export type Scope = "global" | "project"

export type FrameworkAction = "install" | "status" | "update" | "uninstall"

export type ReportStatus =
  | "installed"
  | "updated"
  | "already up to date"
  | "already present (unmanaged)"
  | "skipped"
  | "blocked by missing env"
  | "blocked by missing binary"
  | "configured and enabled"
  | "configured but disabled by missing env"
  | "configured but disabled by missing binary"
  | "configured but requires auth/manual setup"
  | "conflict/manual action required"
  | "removed"

export type AssetGroupId = "commands" | "agents" | "skills" | "instructions"

export type AssetGroup = {
  id: AssetGroupId
  source: string
  targets: Record<Scope, string>
}

export type FrameworkConfigManifest = {
  opencode: {
    schema: string
    instructions: Record<Scope, string[]>
    plugin: string
  }
  tui: {
    schema: string
    plugin: string
  }
}

export type McpRequirement = {
  binaries?: string[]
  env?: string[]
  manual?: boolean
}

export type McpPolicy = {
  config: Record<string, unknown>
  requirements?: McpRequirement
  reason?: string
}

export type FrameworkManifest = {
  manifestVersion: number
  packageName: string
  pluginId: string
  stateFile: string
  assetGroups: AssetGroup[]
  config: FrameworkConfigManifest
  mcp: Record<string, McpPolicy>
}

export type ManagedFileOrigin = "installed" | "adopted"

export type ManagedFileState = {
  group: AssetGroupId
  sourceHash: string
  installedHash: string
  origin: ManagedFileOrigin
}

export type FrameworkInstallState = {
  scope: Scope
  manifestVersion: number
  packageVersion: string
  updatedAt: string
  files: Record<string, ManagedFileState>
  ownership: {
    createdOpencodeConfig: boolean
    createdTuiConfig: boolean
    addedOpencodePlugin: boolean
    addedTuiPlugin: boolean
    addedInstructions: string[]
    addedMcpKeys: string[]
  }
}

export type ReportItem = {
  kind: "asset" | "config" | "mcp" | "runtime"
  name: string
  status: ReportStatus
  detail?: string
}

export type McpDiagnosticStatus = Extract<
  ReportStatus,
  | "configured and enabled"
  | "configured but disabled by missing env"
  | "configured but disabled by missing binary"
  | "configured but requires auth/manual setup"
>

export type McpDiagnostic = {
  name: string
  status: McpDiagnosticStatus
  enabled: boolean
  missingEnv: string[]
  missingBinaries: string[]
  detail: string
  config: Record<string, unknown>
}

export type FrameworkReport = {
  action: FrameworkAction
  scope: Scope
  packageVersion: string
  configDir: string
  projectRoot: string
  restartRequired: boolean
  items: ReportItem[]
  mcp: McpDiagnostic[]
}

export type FrameworkOptions = {
  scope: Scope
  projectRoot?: string
  globalConfigDir?: string
  force?: boolean
  env?: NodeJS.ProcessEnv
}

export type ScopeDetection = {
  scope: Scope
  installed: boolean
  statePath: string
}
