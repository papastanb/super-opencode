import { homedir } from "node:os"
import path from "node:path"

import { findPackageRoot } from "./package-root.js"
import type { FrameworkOptions, Scope } from "./types.js"

export type ScopePaths = {
  scope: Scope
  packageRoot: string
  projectRoot: string
  configDir: string
  opencodeConfigPath: string
  tuiConfigPath: string
  statePath: string
}

function resolveDefaultGlobalConfigDir(env: NodeJS.ProcessEnv): string {
  if (env.OPENCODE_CONFIG_DIR) {
    return path.resolve(env.OPENCODE_CONFIG_DIR)
  }

  return path.join(homedir(), ".config", "opencode")
}

export function resolveProjectRoot(input?: string): string {
  return path.resolve(input ?? process.cwd())
}

export function resolveScopePaths(options: FrameworkOptions, stateFile: string): ScopePaths {
  const env = options.env ?? process.env
  const packageRoot = findPackageRoot(import.meta.url)
  const projectRoot = resolveProjectRoot(options.projectRoot)

  if (options.scope === "global") {
    const configDir = path.resolve(options.globalConfigDir ?? resolveDefaultGlobalConfigDir(env))
    return {
      scope: "global",
      packageRoot,
      projectRoot,
      configDir,
      opencodeConfigPath: path.join(configDir, "opencode.json"),
      tuiConfigPath: path.join(configDir, "tui.json"),
      statePath: path.join(configDir, stateFile),
    }
  }

  const configDir = path.join(projectRoot, ".opencode")
  return {
    scope: "project",
    packageRoot,
    projectRoot,
    configDir,
    opencodeConfigPath: path.join(projectRoot, "opencode.json"),
    tuiConfigPath: path.join(projectRoot, "tui.json"),
    statePath: path.join(configDir, stateFile),
  }
}
