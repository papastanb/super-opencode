import { createHash } from "node:crypto"
import { mkdir, readFile, readdir, rm, rmdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  patchOpencodeConfig,
  patchTuiConfig,
  removeFrameworkConfig,
  removeFrameworkTuiConfig,
  validateJsoncConfigFile,
} from "./config.js"
import { hasPluginSpec, isObject, parseJsoncObject, type JsonObject } from "./jsonc.js"
import { loadFrameworkManifest } from "./manifest.js"
import { resolveScopePaths } from "./paths.js"
import { diagnoseMcpPolicies } from "./prerequisites.js"
import { createEmptyState, readInstallState, removeInstallState, writeInstallState } from "./state.js"
import type {
  AssetGroup,
  FrameworkAction,
  FrameworkOptions,
  FrameworkReport,
  ManagedFileState,
  ReportItem,
  ScopeDetection,
} from "./types.js"

type PackageMetadata = {
  version: string
}

type ConfigSnapshot = {
  exists: boolean
  value?: JsonObject
  error?: string
}

async function readJsoncSnapshot(filePath: string): Promise<ConfigSnapshot> {
  const raw = await readTextIfExists(filePath)
  if (raw === undefined) {
    return { exists: false }
  }

  try {
    return {
      exists: true,
      value: parseJsoncObject(raw, filePath),
    }
  } catch (error) {
    return {
      exists: true,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function createConfigStatusItem(name: string, status: ReportItem["status"], detail: string): ReportItem {
  return {
    kind: "config",
    name,
    status,
    detail,
  }
}

async function inspectOpencodeStatus(options: {
  filePath: string
  statePath: string
  manifest: Awaited<ReturnType<typeof loadFrameworkManifest>>
  scope: FrameworkOptions["scope"]
  diagnostics: Awaited<ReturnType<typeof diagnoseMcpPolicies>>
}): Promise<{ item: ReportItem; ok: boolean }> {
  const snapshot = await readJsoncSnapshot(options.filePath)
  const name = path.basename(options.filePath)

  if (!snapshot.exists) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "config-drift", `Missing config file. Install/update will recreate it. Install state: ${options.statePath}`),
    }
  }

  if (snapshot.error) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `${snapshot.error} Install state: ${options.statePath}`),
    }
  }

  const config = snapshot.value
  if (!config) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `Config could not be parsed. Install state: ${options.statePath}`),
    }
  }

  if (config.plugin !== undefined && !Array.isArray(config.plugin)) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `"plugin" must be an array. Install state: ${options.statePath}`),
    }
  }

  if (config.instructions !== undefined && !Array.isArray(config.instructions)) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `"instructions" must be an array. Install state: ${options.statePath}`),
    }
  }

  if (config.mcp !== undefined && !isObject(config.mcp)) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `"mcp" must be an object. Install state: ${options.statePath}`),
    }
  }

  const driftReasons: string[] = []
  if (config.$schema !== options.manifest.config.opencode.schema) {
    driftReasons.push(`$schema differs from ${options.manifest.config.opencode.schema}`)
  }

  const pluginEntries = Array.isArray(config.plugin) ? config.plugin : []
  if (!hasPluginSpec(pluginEntries, options.manifest.config.opencode.plugin)) {
    driftReasons.push(`missing plugin ${options.manifest.config.opencode.plugin}`)
  }

  const instructions = Array.isArray(config.instructions)
    ? config.instructions.filter((entry): entry is string => typeof entry === "string")
    : []
  const missingInstructions = options.manifest.config.opencode.instructions[options.scope].filter((instruction) => !instructions.includes(instruction))
  if (missingInstructions.length > 0) {
    driftReasons.push(`missing instructions: ${missingInstructions.join(", ")}`)
  }

  const mcp = isObject(config.mcp) ? config.mcp : undefined
  const missingMcpEntries: string[] = []
  const mismatchedMcpEntries: string[] = []
  for (const diagnostic of options.diagnostics) {
    const currentEntry = mcp?.[diagnostic.name]
    if (currentEntry === undefined) {
      missingMcpEntries.push(diagnostic.name)
      continue
    }

    if (!isObject(currentEntry)) {
      return {
        ok: false,
        item: createConfigStatusItem(
          name,
          "invalid-config",
          `"mcp.${diagnostic.name}" must be an object. Install state: ${options.statePath}`,
        ),
      }
    }

    if (currentEntry.enabled !== diagnostic.enabled) {
      mismatchedMcpEntries.push(`${diagnostic.name} enabled=${String(currentEntry.enabled)}`)
    }
  }

  if (missingMcpEntries.length > 0) {
    driftReasons.push(`missing MCP entries: ${missingMcpEntries.join(", ")}`)
  }

  if (mismatchedMcpEntries.length > 0) {
    driftReasons.push(`stale MCP enablement: ${mismatchedMcpEntries.join(", ")}`)
  }

  if (driftReasons.length > 0) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "config-drift", `${driftReasons.join("; ")}. Install state: ${options.statePath}`),
    }
  }

  return {
    ok: true,
    item: createConfigStatusItem(name, "already up to date", `Validated against manifest requirements. Install state: ${options.statePath}`),
  }
}

async function inspectTuiStatus(options: {
  filePath: string
  statePath: string
  manifest: Awaited<ReturnType<typeof loadFrameworkManifest>>
}): Promise<{ item: ReportItem; ok: boolean }> {
  const snapshot = await readJsoncSnapshot(options.filePath)
  const name = path.basename(options.filePath)

  if (!snapshot.exists) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "config-drift", `Missing config file. Install/update will recreate it. Install state: ${options.statePath}`),
    }
  }

  if (snapshot.error) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `${snapshot.error} Install state: ${options.statePath}`),
    }
  }

  const config = snapshot.value
  if (!config) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `Config could not be parsed. Install state: ${options.statePath}`),
    }
  }

  if (config.plugin !== undefined && !Array.isArray(config.plugin)) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "invalid-config", `"plugin" must be an array. Install state: ${options.statePath}`),
    }
  }

  const driftReasons: string[] = []
  if (config.$schema !== options.manifest.config.tui.schema) {
    driftReasons.push(`$schema differs from ${options.manifest.config.tui.schema}`)
  }

  const pluginEntries = Array.isArray(config.plugin) ? config.plugin : []
  if (!hasPluginSpec(pluginEntries, options.manifest.config.tui.plugin)) {
    driftReasons.push(`missing plugin ${options.manifest.config.tui.plugin}`)
  }

  if (driftReasons.length > 0) {
    return {
      ok: false,
      item: createConfigStatusItem(name, "config-drift", `${driftReasons.join("; ")}. Install state: ${options.statePath}`),
    }
  }

  return {
    ok: true,
    item: createConfigStatusItem(name, "already up to date", `Validated against manifest requirements. Install state: ${options.statePath}`),
  }
}

function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex")
}

async function readPackageMetadata(packageRoot: string): Promise<PackageMetadata> {
  const packageJsonPath = path.join(packageRoot, "package.json")
  let packageJson: unknown

  try {
    packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"))
  } catch (error) {
    throw new Error(`Failed to read package metadata from ${packageRoot}: ${(error as Error).message}`)
  }

  if (
    !packageJson ||
    typeof packageJson !== "object" ||
    typeof (packageJson as { version?: unknown }).version !== "string" ||
    (packageJson as { version: string }).version.trim().length === 0
  ) {
    throw new Error(`Invalid package metadata in ${packageRoot}: package.json is missing a non-empty version string.`)
  }

  return { version: (packageJson as { version: string }).version }
}

async function listRelativeFiles(root: string, prefix = ""): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true })
  const files: string[] = []

  for (const entry of entries) {
    if (entry.name === ".gitkeep") {
      continue
    }

    const relativePath = prefix ? path.posix.join(prefix, entry.name) : entry.name
    const absolutePath = path.join(root, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await listRelativeFiles(absolutePath, relativePath)))
      continue
    }

    files.push(relativePath)
  }

  return files.sort()
}

async function readTextIfExists(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, "utf8")
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined
    }

    throw error
  }
}

async function ensureFileParent(filePath: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
}

async function removeEmptyDirectories(startDir: string, stopDir: string): Promise<void> {
  let current = startDir
  const resolvedStopDir = path.resolve(stopDir)
  while (true) {
    const resolvedCurrent = path.resolve(current)
    const relativeToStop = path.relative(resolvedStopDir, resolvedCurrent)
    if (resolvedCurrent === resolvedStopDir || relativeToStop.startsWith("..") || path.isAbsolute(relativeToStop)) {
      return
    }

    let entries: string[]
    try {
      entries = await readdir(current)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code === "ENOENT") {
        return
      }

      throw error
    }

    if (entries.length > 0) {
      return
    }

    try {
      await rmdir(current)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code === "ENOENT" || code === "ENOTEMPTY") {
        return
      }

      throw error
    }

    current = path.dirname(current)
  }
}

function createReport(action: FrameworkAction, scope: FrameworkOptions["scope"], packageVersion: string, configDir: string, projectRoot: string): FrameworkReport {
  return {
    action,
    scope,
    packageVersion,
    configDir,
    projectRoot,
    restartRequired: false,
    items: [],
    mcp: [],
  }
}

async function syncAssets(options: {
  groups: AssetGroup[]
  packageRoot: string
  scope: FrameworkOptions["scope"]
  configDir: string
  projectRoot: string
  stateFiles: Record<string, ManagedFileState>
  reportItems: ReportItem[]
  force: boolean
  dryRun: boolean
}): Promise<boolean> {
  let changed = false

  for (const group of options.groups) {
    const targetBase = options.scope === "global" ? options.configDir : options.projectRoot
    const sourceRoot = path.join(options.packageRoot, group.source)
    const groupTargetRoot = path.join(targetBase, group.targets[options.scope])
    const files = await listRelativeFiles(sourceRoot)

    for (const relativeFile of files) {
      const sourcePath = path.join(sourceRoot, relativeFile)
      const destinationPath = path.join(groupTargetRoot, relativeFile)
      const destinationKey = path.relative(targetBase, destinationPath).split(path.sep).join("/")
      const sourceContent = await readFile(sourcePath, "utf8")
      const sourceHash = hashContent(sourceContent)
      const destinationContent = await readTextIfExists(destinationPath)
      const previousState = options.stateFiles[destinationKey]

      if (destinationContent === undefined) {
        if (!options.dryRun) {
          await ensureFileParent(destinationPath)
          await writeFile(destinationPath, sourceContent, "utf8")
          options.stateFiles[destinationKey] = {
            group: group.id,
            sourceHash,
            installedHash: sourceHash,
            origin: "installed",
          }
        }

        changed ||= !options.dryRun
        options.reportItems.push({
          kind: "asset",
          name: destinationKey,
          status: options.dryRun ? "skipped" : "installed",
          detail: options.dryRun ? "Asset is not installed in this scope." : undefined,
        })
        continue
      }

      const destinationHash = hashContent(destinationContent)
      if (destinationHash === sourceHash) {
        // Only mark as managed if it was previously installed by us
        if (previousState) {
          options.stateFiles[destinationKey] = {
            group: group.id,
            sourceHash,
            installedHash: sourceHash,
            origin: previousState.origin,
          }
        } else {
          // For files that already exist with matching content but weren't previously managed,
          // we add them to state.files as "adopted" so we know not to delete them during uninstall
          options.stateFiles[destinationKey] = {
            group: group.id,
            sourceHash,
            installedHash: sourceHash,
            origin: "adopted",
          }
        }
        options.reportItems.push({ 
          kind: "asset", 
          name: destinationKey, 
          status: previousState ? "already up to date" : "already present (unmanaged)",
          detail: previousState ? undefined : "File already exists with matching content but is not managed by the framework." 
        })
        continue
      }

      if (previousState && previousState.installedHash === destinationHash) {
        if (!options.dryRun) {
          await ensureFileParent(destinationPath)
          await writeFile(destinationPath, sourceContent, "utf8")
          options.stateFiles[destinationKey] = {
            group: group.id,
            sourceHash,
            installedHash: sourceHash,
            origin: "installed",
          }
        }

        changed ||= !options.dryRun
        options.reportItems.push({
          kind: "asset",
          name: destinationKey,
          status: options.dryRun ? "skipped" : "updated",
          detail: options.dryRun ? "Asset is outdated and would update on install/update." : undefined,
        })
        continue
      }

      if (options.force) {
        if (!options.dryRun) {
          await ensureFileParent(destinationPath)
          await writeFile(destinationPath, sourceContent, "utf8")
          options.stateFiles[destinationKey] = {
            group: group.id,
            sourceHash,
            installedHash: sourceHash,
            origin: "installed",
          }
        }

        changed ||= !options.dryRun
        options.reportItems.push({
          kind: "asset",
          name: destinationKey,
          status: options.dryRun ? "skipped" : "updated",
          detail: options.dryRun ? "Asset would be overwritten with --force." : "Overwritten with --force.",
        })
        continue
      }

      options.reportItems.push({
        kind: "asset",
        name: destinationKey,
        status: "conflict/manual action required",
        detail: "Destination file diverged from the managed hash. Re-run with --force or resolve manually.",
      })
    }
  }

  return changed
}

/** Installs or resynchronizes the framework into the requested scope. */
export async function installFramework(options: FrameworkOptions): Promise<FrameworkReport> {
  const manifest = await loadFrameworkManifest()
  const paths = resolveScopePaths(options, manifest.stateFile)
  const packageMetadata = await readPackageMetadata(paths.packageRoot)
  const report = createReport("install", options.scope, packageMetadata.version, paths.configDir, paths.projectRoot)
  const state = (await readInstallState(paths.statePath)) ?? createEmptyState(options.scope, packageMetadata.version, manifest.manifestVersion)
  const diagnostics = await diagnoseMcpPolicies(manifest, options.env ?? process.env)
  report.mcp = diagnostics

  await validateJsoncConfigFile(paths.opencodeConfigPath)
  await validateJsoncConfigFile(paths.tuiConfigPath)

  const assetsChanged = await syncAssets({
    groups: manifest.assetGroups,
    packageRoot: paths.packageRoot,
    scope: options.scope,
    configDir: paths.configDir,
    projectRoot: paths.projectRoot,
    stateFiles: state.files,
    reportItems: report.items,
    force: options.force ?? false,
    dryRun: false,
  })

  const opencodeResult = await patchOpencodeConfig({
    filePath: paths.opencodeConfigPath,
    manifest,
    scope: options.scope,
    diagnostics,
    state,
  })
  state.ownership.createdOpencodeConfig ||= opencodeResult.created
  state.ownership.addedOpencodePlugin ||= opencodeResult.addedPlugin
  state.ownership.addedInstructions = Array.from(new Set([...state.ownership.addedInstructions, ...opencodeResult.addedInstructions]))
  state.ownership.addedMcpKeys = Array.from(new Set([...state.ownership.addedMcpKeys, ...opencodeResult.addedMcpKeys]))
  state.ownership.addedMcpHashes = {
    ...state.ownership.addedMcpHashes,
    ...opencodeResult.addedMcpHashes,
  }

  report.items.push({
    kind: "config",
    name: path.relative(paths.projectRoot, paths.opencodeConfigPath) || path.basename(paths.opencodeConfigPath),
    status: opencodeResult.changed ? (opencodeResult.created ? "installed" : "updated") : "already up to date",
  })

  const tuiResult = await patchTuiConfig({
    filePath: paths.tuiConfigPath,
    manifest,
  })
  state.ownership.createdTuiConfig ||= tuiResult.created
  state.ownership.addedTuiPlugin ||= tuiResult.addedPlugin

  report.items.push({
    kind: "config",
    name: path.relative(paths.projectRoot, paths.tuiConfigPath) || path.basename(paths.tuiConfigPath),
    status: tuiResult.changed ? (tuiResult.created ? "installed" : "updated") : "already up to date",
  })

  for (const diagnostic of diagnostics) {
    // Keep MCP diagnostics in both collections: report.mcp drives dedicated views while report.items feeds aggregate summaries.
    report.items.push({
      kind: "mcp",
      name: diagnostic.name,
      status: diagnostic.status,
      detail: diagnostic.detail,
    })
  }

  state.updatedAt = new Date().toISOString()
  state.manifestVersion = manifest.manifestVersion
  state.packageVersion = packageMetadata.version
  await writeInstallState(paths.statePath, state)

  report.restartRequired = assetsChanged || opencodeResult.changed || tuiResult.changed
  if (report.restartRequired) {
    report.items.push({
      kind: "runtime",
      name: "OpenCode runtime",
      status: "updated",
      detail: "Restart OpenCode to discover new commands, agents, skills, instructions, and MCP configuration.",
    })
  } else {
    report.items.push({
      kind: "runtime",
      name: "OpenCode runtime",
      status: "already up to date",
      detail: "No restart is required because no bootstrap-managed files changed.",
    })
  }

  return report
}

/** Reuses the install flow to refresh an existing framework installation. */
export async function updateFramework(options: FrameworkOptions): Promise<FrameworkReport> {
  const report = await installFramework(options)
  report.action = "update"
  return report
}

/** Reports the current framework state for a scope without mutating files. */
export async function statusFramework(options: FrameworkOptions): Promise<FrameworkReport> {
  const manifest = await loadFrameworkManifest()
  const paths = resolveScopePaths(options, manifest.stateFile)
  const packageMetadata = await readPackageMetadata(paths.packageRoot)
  const report = createReport("status", options.scope, packageMetadata.version, paths.configDir, paths.projectRoot)
  const state = (await readInstallState(paths.statePath)) ?? createEmptyState(options.scope, packageMetadata.version, manifest.manifestVersion)
  const diagnostics = await diagnoseMcpPolicies(manifest, options.env ?? process.env)
  report.mcp = diagnostics

  await syncAssets({
    groups: manifest.assetGroups,
    packageRoot: paths.packageRoot,
    scope: options.scope,
    configDir: paths.configDir,
    projectRoot: paths.projectRoot,
    stateFiles: { ...state.files },
    reportItems: report.items,
    force: false,
    dryRun: true,
  })

  for (const diagnostic of diagnostics) {
    // Keep MCP diagnostics in both collections: report.mcp drives dedicated views while report.items feeds aggregate summaries.
    report.items.push({
      kind: "mcp",
      name: diagnostic.name,
      status: diagnostic.status,
      detail: diagnostic.detail,
    })
  }

  const [opencodeStatus, tuiStatus] = await Promise.all([
    inspectOpencodeStatus({
      filePath: paths.opencodeConfigPath,
      statePath: paths.statePath,
      manifest,
      scope: options.scope,
      diagnostics,
    }),
    inspectTuiStatus({
      filePath: paths.tuiConfigPath,
      statePath: paths.statePath,
      manifest,
    }),
  ])

  report.items.push(opencodeStatus.item, tuiStatus.item)

  const runtimeStatus = opencodeStatus.ok && tuiStatus.ok ? "skipped" : report.items.some((item) => item.status === "invalid-config") ? "invalid-config" : "config-drift"

  report.items.push({
    kind: "runtime",
    name: "OpenCode runtime",
    status: runtimeStatus,
    detail:
      runtimeStatus === "skipped"
        ? `Install state file: ${paths.statePath}`
        : `Config validation found issues in bootstrap-managed files. Install state file: ${paths.statePath}`,
  })

  return report
}

/** Uninstalls framework-managed files and config from the requested scope. */
export async function uninstallFramework(options: FrameworkOptions): Promise<FrameworkReport> {
  const manifest = await loadFrameworkManifest()
  const paths = resolveScopePaths(options, manifest.stateFile)
  const packageMetadata = await readPackageMetadata(paths.packageRoot)
  const report = createReport("uninstall", options.scope, packageMetadata.version, paths.configDir, paths.projectRoot)
  const state = await readInstallState(paths.statePath)

  if (!state) {
    report.items.push({
      kind: "runtime",
      name: "install state",
      status: "skipped",
      detail: "No framework install state was found for this scope.",
    })
    return report
  }

  await validateJsoncConfigFile(paths.opencodeConfigPath)
  await validateJsoncConfigFile(paths.tuiConfigPath)

  const targetBase = options.scope === "global" ? paths.configDir : paths.projectRoot
  let changed = false
  const remainingFiles: typeof state.files = {}
  for (const [relativePath, fileState] of Object.entries(state.files)) {
    const filePath = path.join(targetBase, relativePath)
    const content = await readTextIfExists(filePath)
    if (content === undefined) {
      report.items.push({ kind: "asset", name: relativePath, status: "skipped", detail: "File already absent." })
      continue
    }

    const currentHash = hashContent(content)
    // Skip deleting adopted files unless --force is used
    if (fileState.origin === "adopted" && !(options.force ?? false)) {
      report.items.push({
        kind: "asset",
        name: relativePath,
        status: "skipped",
        detail: "File is unmanaged (adopted) and will not be removed unless --force is used.",
      })
      continue
    }
    
    if (currentHash !== fileState.installedHash && !(options.force ?? false)) {
      remainingFiles[relativePath] = fileState
      report.items.push({
        kind: "asset",
        name: relativePath,
        status: "conflict/manual action required",
        detail: "Managed file was modified after install. Re-run with --force or remove it manually.",
      })
      continue
    }

    await unlink(filePath)
    await removeEmptyDirectories(path.dirname(filePath), options.scope === "global" ? paths.configDir : paths.projectRoot)
    changed = true
    report.items.push({ kind: "asset", name: relativePath, status: "removed", detail: `Removed managed ${fileState.group} asset.` })
  }

  if (Object.keys(remainingFiles).length > 0) {
    const nextState = {
      ...state,
      files: remainingFiles,
      updatedAt: new Date().toISOString(),
    }
    await writeInstallState(paths.statePath, nextState)
    report.restartRequired = changed
    report.items.push({
      kind: "runtime",
      name: "OpenCode runtime",
      status: "conflict/manual action required",
      detail: "Uninstall stopped because some managed files were modified. Install state was preserved for the remaining assets.",
    })
    return report
  }

  const opencodeResult = await removeFrameworkConfig({
    filePath: paths.opencodeConfigPath,
    manifest,
    state,
  })
  if (opencodeResult.changed) {
    changed = true
    report.items.push({
      kind: "config",
      name: path.basename(paths.opencodeConfigPath),
      status: opencodeResult.removedFile ? "removed" : "updated",
    })
  }

  for (const key of opencodeResult.conflicts) {
    report.items.push({
      kind: "mcp",
      name: key,
      status: "conflict/manual action required",
      detail: "Framework-added MCP entry was modified after install and was left in place.",
    })
  }

  const tuiResult = await removeFrameworkTuiConfig({
    filePath: paths.tuiConfigPath,
    manifest,
    state,
  })
  if (tuiResult.changed) {
    changed = true
    report.items.push({
      kind: "config",
      name: path.basename(paths.tuiConfigPath),
      status: tuiResult.removedFile ? "removed" : "updated",
    })
  }

  if (opencodeResult.conflicts.length > 0) {
    await writeInstallState(paths.statePath, {
      ...state,
      files: {},
      ownership: {
        createdOpencodeConfig: state.ownership.createdOpencodeConfig && !opencodeResult.removedFile,
        createdTuiConfig: state.ownership.createdTuiConfig && !tuiResult.removedFile,
        addedOpencodePlugin: false,
        addedTuiPlugin: false,
        addedInstructions: [],
        addedMcpKeys: opencodeResult.remainingAddedMcpKeys,
        addedMcpHashes: opencodeResult.remainingAddedMcpHashes,
      },
      updatedAt: new Date().toISOString(),
    })
    report.restartRequired = changed
    report.items.push({
      kind: "runtime",
      name: "OpenCode runtime",
      status: "conflict/manual action required",
      detail: "Uninstall stopped because some framework-managed MCP entries were modified. Install state was preserved for the remaining config cleanup.",
    })
    return report
  }

  await removeInstallState(paths.statePath)
  await removeEmptyDirectories(
    path.dirname(paths.statePath),
    options.scope === "global" ? paths.configDir : path.join(paths.projectRoot, ".opencode"),
  )
  report.restartRequired = changed
  report.items.push({
    kind: "runtime",
    name: "OpenCode runtime",
    status: changed ? "updated" : "skipped",
    detail: changed
      ? "Restart OpenCode to unload removed framework assets for this scope."
      : "No managed framework files were removed.",
  })

  return report
}

/** Detects whether global and project scopes currently have persisted framework state. */
export async function detectFrameworkScopes(options: Omit<FrameworkOptions, "scope"> = {}): Promise<ScopeDetection[]> {
  const manifest = await loadFrameworkManifest()
  const globalPaths = resolveScopePaths({ ...options, scope: "global" }, manifest.stateFile)
  const projectPaths = resolveScopePaths({ ...options, scope: "project" }, manifest.stateFile)

  const [globalState, projectState] = await Promise.all([
    readInstallState(globalPaths.statePath),
    readInstallState(projectPaths.statePath),
  ])

  return [
    {
      scope: "global",
      installed: Boolean(globalState),
      statePath: globalPaths.statePath,
    },
    {
      scope: "project",
      installed: Boolean(projectState),
      statePath: projectPaths.statePath,
    },
  ]
}
