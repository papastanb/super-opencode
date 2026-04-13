import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { applyEdits, modify, parse } from "jsonc-parser"

import type { FrameworkInstallState, FrameworkManifest, McpDiagnostic, ReportItem, Scope, ScopeDetection } from "./types.js"

type JsonObject = Record<string, unknown>

type ConfigPatchResult = {
  changed: boolean
  created: boolean
  addedPlugin: boolean
  addedInstructions: string[]
  addedMcpKeys: string[]
}

type TuiPatchResult = {
  changed: boolean
  created: boolean
  addedPlugin: boolean
}

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
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
    const parsed = parse(raw)
    if (!isObject(parsed)) {
      return { created: false, value: {} }
    }

    return { created: false, value: parsed }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { created: true, value: {} }
    }

    throw error
  }
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
  await mkdir(path.dirname(filePath), { recursive: true })

  let originalText: string | undefined
  try {
    originalText = await readFile(filePath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error
    }
  }

  if (originalText === undefined) {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
    return
  }

  try {
    const parsed = parse(originalText)
    if (!isObject(parsed)) {
      throw new Error("Config root is not an object")
    }

    const updatedText = applyJsoncObjectEdits(originalText, parsed, value)
    await writeFile(filePath, updatedText.endsWith("\n") ? updatedText : `${updatedText}\n`, "utf8")
  } catch {
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
  }
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

function hasPluginSpec(plugins: Array<string | [string, Record<string, unknown>]>, spec: string): boolean {
  return plugins.some((entry) => {
    const value = typeof entry === "string" ? entry : entry[0]
    return value === spec || value.startsWith(`${spec}@`)
  })
}

function ensureStringArray(input: unknown): string[] {
  return Array.isArray(input) ? input.filter((entry): entry is string => typeof entry === "string") : []
}

/** Merges framework requirements into opencode.json while preserving JSONC comments when possible. */
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

  if (typeof config.$schema !== "string") {
    config.$schema = options.manifest.config.opencode.schema
    changed = true
  }

  const plugins = normalizePluginArray(config.plugin)
  let addedPlugin = false
  if (!hasPluginSpec(plugins, options.manifest.config.opencode.plugin)) {
    plugins.push(options.manifest.config.opencode.plugin)
    config.plugin = plugins
    changed = true
    addedPlugin = true
  } else if (plugins.length > 0) {
    config.plugin = plugins
  }

  const instructions = ensureStringArray(config.instructions)
  const addedInstructions: string[] = []
  for (const instruction of options.manifest.config.opencode.instructions[options.scope]) {
    if (!instructions.includes(instruction)) {
      instructions.push(instruction)
      addedInstructions.push(instruction)
      changed = true
    }
  }
  if (instructions.length > 0) {
    config.instructions = instructions
  }

  const existingMcp = isObject(config.mcp) ? config.mcp : {}
  const mergedMcp: JsonObject = { ...existingMcp }
  const addedMcpKeys: string[] = []
  for (const diagnostic of options.diagnostics) {
    const currentValue = isObject(mergedMcp[diagnostic.name]) ? (mergedMcp[diagnostic.name] as JsonObject) : undefined
    if (!currentValue) {
      addedMcpKeys.push(diagnostic.name)
    }

    const mergedValue = currentValue ? mergeObjects(diagnostic.config, currentValue) : { ...diagnostic.config }
    mergedValue.enabled = diagnostic.enabled
    if (!isObject(currentValue) || !jsonValuesEqual(currentValue, mergedValue)) {
      changed = true
    }

    mergedMcp[diagnostic.name] = mergedValue
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

  if (typeof config.$schema !== "string") {
    config.$schema = options.manifest.config.tui.schema
    changed = true
  }

  const plugins = normalizePluginArray(config.plugin)
  let addedPlugin = false
  if (!hasPluginSpec(plugins, options.manifest.config.tui.plugin)) {
    plugins.push(options.manifest.config.tui.plugin)
    config.plugin = plugins
    changed = true
    addedPlugin = true
  } else if (plugins.length > 0) {
    config.plugin = plugins
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

function removePluginSpec(plugins: Array<string | [string, Record<string, unknown>]>, spec: string) {
  return plugins.filter((entry) => {
    const value = typeof entry === "string" ? entry : entry[0]
    return value !== spec && !value.startsWith(`${spec}@`)
  })
}

function removeInstructions(instructions: string[], managed: string[]): string[] {
  return instructions.filter((entry) => !managed.includes(entry))
}

/** Removes framework-managed opencode.json entries that were added for this scope. */
export async function removeFrameworkConfig(options: {
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

  if (options.state.ownership.addedOpencodePlugin) {
    const plugins = removePluginSpec(normalizePluginArray(config.plugin), options.manifest.config.opencode.plugin)
    if (plugins.length > 0) {
      config.plugin = plugins
    } else {
      delete config.plugin
    }
    changed = true
  }

  if (options.state.ownership.addedInstructions.length > 0) {
    const instructions = removeInstructions(ensureStringArray(config.instructions), options.state.ownership.addedInstructions)
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
      delete nextMcp[key]
    }
    if (Object.keys(nextMcp).length > 0) {
      config.mcp = nextMcp
    } else {
      delete config.mcp
    }
    changed = true
  }

  if (!changed) {
    return { changed: false, removedFile: false }
  }

  await writeJson(options.filePath, config)
  return { changed: true, removedFile: false }
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
    const plugins = removePluginSpec(normalizePluginArray(config.plugin), options.manifest.config.tui.plugin)
    if (plugins.length > 0) {
      config.plugin = plugins
    } else {
      delete config.plugin
    }
    changed = true
  }

  if (!changed) {
    return { changed: false, removedFile: false }
  }

  await writeJson(options.filePath, config)
  return { changed: true, removedFile: false }
}

/** Builds a standard report item for config file writes. */
export function configReportItems(kind: "opencode" | "tui", changed: boolean, created: boolean): ReportItem[] {
  if (changed) {
    return [
      {
        kind: "config",
        name: `${kind}.json`,
        status: created ? "installed" : "updated",
      },
    ]
  }

  return [
    {
      kind: "config",
      name: `${kind}.json`,
      status: "already up to date",
    },
  ]
}
