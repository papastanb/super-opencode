import { createHash } from "node:crypto"
import { readFile, rm } from "node:fs/promises"

import { applyEdits, modify } from "jsonc-parser"

import { writeTextAtomically } from "./file-write.js"
import { hasPluginSpec, isObject, parseJsoncObject, type JsonObject } from "./jsonc.js"
import type { FrameworkInstallState, FrameworkManifest, McpDiagnostic, Scope } from "./types.js"

type ConfigPatchResult = {
  changed: boolean
  created: boolean
  addedPlugin: boolean
  addedInstructions: string[]
  addedMcpKeys: string[]
  addedMcpHashes: Record<string, string>
}

type TuiPatchResult = {
  changed: boolean
  created: boolean
  addedPlugin: boolean
}

/** Produces a deterministic JSON-safe value shape for stable hashing and equality checks. */
function stableJsonValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => stableJsonValue(entry))
  }

  if (!isObject(value)) {
    return value
  }

  return Object.keys(value)
    .sort()
    .reduce<JsonObject>((result, key) => {
      result[key] = stableJsonValue(value[key])
      return result
    }, {})
}

/** Hashes a JSON value after stable key ordering so persisted ownership checks are reproducible. */
function hashJsonValue(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(stableJsonValue(value))).digest("hex")
}


function mergeObjects(base: JsonObject, override: JsonObject): JsonObject {
  const result: JsonObject = { ...base }

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key]
    if (isObject(existing) && isObject(value)) {
      result[key] = mergeObjects(existing, value)
      continue
    }

    result[key] = value
  }

  return result
}

function jsonValuesEqual(left: unknown, right: unknown): boolean {
  if (left === right) {
    return true
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) {
      return false
    }

    return left.every((entry, index) => jsonValuesEqual(entry, right[index]))
  }

  if (isObject(left) || isObject(right)) {
    if (!isObject(left) || !isObject(right)) {
      return false
    }

    const leftKeys = Object.keys(left).sort()
    const rightKeys = Object.keys(right).sort()
    if (!jsonValuesEqual(leftKeys, rightKeys)) {
      return false
    }

    return leftKeys.every((key) => jsonValuesEqual(left[key], right[key]))
  }

  return false
}

async function readJsoncObject(filePath: string): Promise<{ created: boolean; value: JsonObject }> {
  try {
    const raw = await readFile(filePath, "utf8")
    return { created: false, value: parseJsoncObject(raw, filePath) }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { created: true, value: {} }
    }

    throw error
  }
}

/** Validates that an existing JSONC config file parses cleanly as an object. */
export async function validateJsoncConfigFile(filePath: string): Promise<void> {
  await readJsoncObject(filePath)
}

const jsonFormattingOptions = {
  insertSpaces: true,
  tabSize: 2,
  eol: "\n",
}

function applyJsoncObjectEdits(sourceText: string, currentValue: JsonObject, nextValue: JsonObject, pathSegments: string[] = []): string {
  let updatedText = sourceText
  const keys = new Set([...Object.keys(currentValue), ...Object.keys(nextValue)])

  for (const key of keys) {
    const currentChild = currentValue[key]
    const nextHasKey = Object.prototype.hasOwnProperty.call(nextValue, key)
    const nextChild = nextValue[key]

    if (isObject(currentChild) && nextHasKey && isObject(nextChild)) {
      updatedText = applyJsoncObjectEdits(updatedText, currentChild, nextChild, [...pathSegments, key])
      continue
    }

    const edits = modify(updatedText, [...pathSegments, key], nextHasKey ? nextChild : undefined, {
      formattingOptions: jsonFormattingOptions,
    })
    updatedText = applyEdits(updatedText, edits)
  }

  return updatedText
}

async function writeJson(filePath: string, value: JsonObject): Promise<void> {
  let originalText: string | undefined
  try {
    originalText = await readFile(filePath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error
    }
  }

  if (originalText === undefined) {
    await writeTextAtomically(filePath, `${JSON.stringify(value, null, 2)}\n`)
    return
  }

  // Re-read the source text here so JSONC edits preserve comments and user formatting from the current on-disk file.
  const parsed = parseJsoncObject(originalText, filePath)
  const updatedText = applyJsoncObjectEdits(originalText, parsed, value)
  await writeTextAtomically(filePath, updatedText.endsWith("\n") ? updatedText : `${updatedText}\n`)
}

function normalizePluginArray(input: unknown): Array<string | [string, Record<string, unknown>]> {
  if (!Array.isArray(input)) {
    return []
  }

  return input.filter((entry): entry is string | [string, Record<string, unknown>] => {
    if (typeof entry === "string") {
      return true
    }

    return Array.isArray(entry) && typeof entry[0] === "string"
  })
}

function ensureStringArray(input: unknown): string[] {
  return Array.isArray(input) ? input.filter((entry): entry is string => typeof entry === "string") : []
}

function readArrayConfigValue(config: JsonObject, key: string, filePath: string): unknown[] {
  const value = config[key]
  if (value === undefined) {
    return []
  }

  if (!Array.isArray(value)) {
    throw new Error(`Invalid OpenCode config in ${filePath}: "${key}" must be an array.`)
  }

  return [...value]
}

// Dead code: ensureArray was replaced by readArrayConfigValue which validates array shapes before use
// function ensureArray(input: unknown): unknown[] {
//   return Array.isArray(input) ? [...input] : []
// }

/**
 * Merges framework requirements into opencode.json while preserving JSONC comments when possible.
 * Existing user MCP entries keep their explicit fields unless the entry is still framework-managed
 * and matches its recorded ownership hash, in which case framework defaults can refresh on update.
 * For pre-existing or diverged entries, user-provided MCP fields keep priority so local overrides stay intact.
 */
export async function patchOpencodeConfig(options: {
  filePath: string
  manifest: FrameworkManifest
  scope: Scope
  diagnostics: McpDiagnostic[]
  state?: FrameworkInstallState
}): Promise<ConfigPatchResult> {
  const { created, value } = await readJsoncObject(options.filePath)
  const config: JsonObject = { ...value }
  let changed = created
  const addedMcpHashes: Record<string, string> = { ...(options.state?.ownership.addedMcpHashes ?? {}) }

  if (config.$schema !== options.manifest.config.opencode.schema) {
    config.$schema = options.manifest.config.opencode.schema
    changed = true
  }

  const existingPluginEntries = readArrayConfigValue(config, "plugin", options.filePath)
  const plugins = normalizePluginArray(existingPluginEntries)
  let addedPlugin = false
  if (!hasPluginSpec(plugins, options.manifest.config.opencode.plugin)) {
    config.plugin = [...existingPluginEntries, options.manifest.config.opencode.plugin]
    changed = true
    addedPlugin = true
  }

  const instructions = readArrayConfigValue(config, "instructions", options.filePath)
  const instructionStrings = ensureStringArray(instructions)
  const addedInstructions: string[] = []
  for (const instruction of options.manifest.config.opencode.instructions[options.scope]) {
    if (!instructionStrings.includes(instruction)) {
      instructions.push(instruction)
      instructionStrings.push(instruction)
      addedInstructions.push(instruction)
      changed = true
    }
  }
  if (instructions.length > 0) {
    config.instructions = instructions
  }

  if (config.mcp !== undefined && !isObject(config.mcp)) {
    throw new Error(`Invalid OpenCode config in ${options.filePath}: "mcp" must be an object.`)
  }

  const existingMcp = isObject(config.mcp) ? config.mcp : {}
  const mergedMcp: JsonObject = { ...existingMcp }
  const addedMcpKeys: string[] = []
  for (const diagnostic of options.diagnostics) {
    const currentEntry = mergedMcp[diagnostic.name]
    if (currentEntry !== undefined && !isObject(currentEntry)) {
      throw new Error(`Invalid OpenCode config in ${options.filePath}: "mcp.${diagnostic.name}" must be an object.`)
    }

    const currentValue = isObject(currentEntry) ? (currentEntry as JsonObject) : undefined
    const wasPreviouslyManaged = options.state?.ownership.addedMcpKeys.includes(diagnostic.name) ?? false
    const previousManagedHash = options.state?.ownership.addedMcpHashes[diagnostic.name]
    const divergedManagedEntry = currentValue !== undefined && previousManagedHash !== undefined && hashJsonValue(currentValue) !== previousManagedHash
    const shouldRefreshManagedEntry = wasPreviouslyManaged && previousManagedHash !== undefined && !divergedManagedEntry

    if (currentValue === undefined) {
      addedMcpKeys.push(diagnostic.name)
    }

    // Managed MCP entries that still match their recorded hash should follow framework defaults on update.
    // Diverged or pre-existing user entries keep their explicit values except for prerequisite-driven enablement.
    const mergedValue = shouldRefreshManagedEntry
      ? mergeObjects({}, diagnostic.config)
      : currentValue
        ? mergeObjects(diagnostic.config, currentValue)
        : { ...diagnostic.config }

    // Prerequisite diagnostics remain authoritative for runtime enablement.
    mergedValue.enabled = diagnostic.enabled
    const entryChanged = currentValue === undefined || !jsonValuesEqual(currentValue, mergedValue)
    if (entryChanged) {
      changed = true
    }

    mergedMcp[diagnostic.name] = mergedValue

    if (currentValue === undefined || (wasPreviouslyManaged && (previousManagedHash === undefined || !divergedManagedEntry))) {
      addedMcpHashes[diagnostic.name] = hashJsonValue(mergedValue)
    }
  }
  config.mcp = mergedMcp

  if (changed) {
    await writeJson(options.filePath, config)
  }

  return {
    changed,
    created,
    addedPlugin,
    addedInstructions,
    addedMcpKeys,
    addedMcpHashes,
  }
}

/** Ensures the framework TUI plugin is present in the scope-local tui.json file. */
export async function patchTuiConfig(options: {
  filePath: string
  manifest: FrameworkManifest
}): Promise<TuiPatchResult> {
  const { created, value } = await readJsoncObject(options.filePath)
  const config: JsonObject = { ...value }
  let changed = created

  if (config.$schema !== options.manifest.config.tui.schema) {
    config.$schema = options.manifest.config.tui.schema
    changed = true
  }

  const existingPluginEntries = readArrayConfigValue(config, "plugin", options.filePath)
  const plugins = normalizePluginArray(existingPluginEntries)
  let addedPlugin = false
  if (!hasPluginSpec(plugins, options.manifest.config.tui.plugin)) {
    config.plugin = [...existingPluginEntries, options.manifest.config.tui.plugin]
    changed = true
    addedPlugin = true
  }

  if (changed) {
    await writeJson(options.filePath, config)
  }

  return {
    changed,
    created,
    addedPlugin,
  }
}

function removePluginSpecFromEntries(entries: unknown[], spec: string): unknown[] {
  return entries.filter((entry) => {
    if (typeof entry === "string") {
      return entry !== spec && !entry.startsWith(`${spec}@`)
    }

    if (Array.isArray(entry) && typeof entry[0] === "string") {
      return entry[0] !== spec && !entry[0].startsWith(`${spec}@`)
    }

    return true
  })
}

function removeManagedInstructionEntries(entries: unknown[], managed: string[]): unknown[] {
  return entries.filter((entry) => typeof entry !== "string" || !managed.includes(entry))
}

/** Treats schema-only configs as disposable when the framework created the file. */
function hasMeaningfulConfigContent(config: JsonObject): boolean {
  return Object.keys(config).some((key) => key !== "$schema")
}

/** Removes framework-managed opencode.json entries that were added for this scope. */
export async function removeFrameworkConfig(options: {
  filePath: string
  manifest: FrameworkManifest
  state: FrameworkInstallState
}): Promise<{
  changed: boolean
  removedFile: boolean
  conflicts: string[]
  remainingAddedMcpKeys: string[]
  remainingAddedMcpHashes: Record<string, string>
}> {
  const { created, value } = await readJsoncObject(options.filePath)
  if (created) {
    return {
      changed: false,
      removedFile: false,
      conflicts: [],
      remainingAddedMcpKeys: [],
      remainingAddedMcpHashes: {},
    }
  }

  const config: JsonObject = { ...value }
  let changed = false
  const conflicts: string[] = []
  const remainingAddedMcpKeys: string[] = []
  const remainingAddedMcpHashes: Record<string, string> = {}

  if (options.state.ownership.addedOpencodePlugin) {
    const plugins = removePluginSpecFromEntries(readArrayConfigValue(config, "plugin", options.filePath), options.manifest.config.opencode.plugin)
    if (plugins.length > 0) {
      config.plugin = plugins
    } else {
      delete config.plugin
    }
    changed = true
  }

  if (options.state.ownership.addedInstructions.length > 0) {
    const instructions = removeManagedInstructionEntries(
      readArrayConfigValue(config, "instructions", options.filePath),
      options.state.ownership.addedInstructions,
    )
    if (instructions.length > 0) {
      config.instructions = instructions
    } else {
      delete config.instructions
    }
    changed = true
  }

  if (options.state.ownership.addedMcpKeys.length > 0 && isObject(config.mcp)) {
    const nextMcp = { ...config.mcp }
    for (const key of options.state.ownership.addedMcpKeys) {
      if (!Object.prototype.hasOwnProperty.call(nextMcp, key)) {
        continue
      }

      const expectedHash = options.state.ownership.addedMcpHashes[key]
      if (expectedHash === undefined) {
        conflicts.push(key)
        remainingAddedMcpKeys.push(key)
        continue
      }

      if (hashJsonValue(nextMcp[key]) !== expectedHash) {
        conflicts.push(key)
        remainingAddedMcpKeys.push(key)
        remainingAddedMcpHashes[key] = expectedHash
        continue
      }

      delete nextMcp[key]
      changed = true
    }

    if (Object.keys(nextMcp).length > 0) {
      config.mcp = nextMcp
    } else if (Object.prototype.hasOwnProperty.call(config, "mcp")) {
      delete config.mcp
      changed = true
    }
  }

  if (options.state.ownership.createdOpencodeConfig && conflicts.length === 0 && !hasMeaningfulConfigContent(config)) {
    await rm(options.filePath, { force: true })
    return {
      changed: true,
      removedFile: true,
      conflicts,
      remainingAddedMcpKeys,
      remainingAddedMcpHashes,
    }
  }

  if (!changed) {
    return {
      changed: false,
      removedFile: false,
      conflicts,
      remainingAddedMcpKeys,
      remainingAddedMcpHashes,
    }
  }

  await writeJson(options.filePath, config)
  return {
    changed: true,
    removedFile: false,
    conflicts,
    remainingAddedMcpKeys,
    remainingAddedMcpHashes,
  }
}

/** Removes the framework TUI plugin entry from the scope-local tui.json during uninstall. */
export async function removeFrameworkTuiConfig(options: {
  filePath: string
  manifest: FrameworkManifest
  state: FrameworkInstallState
}): Promise<{ changed: boolean; removedFile: boolean }> {
  const { created, value } = await readJsoncObject(options.filePath)
  if (created) {
    return { changed: false, removedFile: false }
  }

  const config: JsonObject = { ...value }
  let changed = false
  if (options.state.ownership.addedTuiPlugin) {
    const plugins = removePluginSpecFromEntries(readArrayConfigValue(config, "plugin", options.filePath), options.manifest.config.tui.plugin)
    if (plugins.length > 0) {
      config.plugin = plugins
    } else {
      delete config.plugin
    }
    changed = true
  }

  if (!changed) {
    if (options.state.ownership.createdTuiConfig && !hasMeaningfulConfigContent(config)) {
      await rm(options.filePath, { force: true })
      return { changed: true, removedFile: true }
    }

    return { changed: false, removedFile: false }
  }

  if (options.state.ownership.createdTuiConfig && !hasMeaningfulConfigContent(config)) {
    await rm(options.filePath, { force: true })
    return { changed: true, removedFile: true }
  }

  await writeJson(options.filePath, config)
  return { changed: true, removedFile: false }
}
