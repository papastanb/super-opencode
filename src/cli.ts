import process from "node:process"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { detectFrameworkScopes, installFramework, statusFramework, uninstallFramework, updateFramework } from "./framework/engine.js"
import type { FrameworkOptions, FrameworkReport, Scope } from "./framework/types.js"

function parseScope(value: string | undefined): Scope {
  if (value === "global" || value === "project") {
    return value
  }

  throw new Error("Missing required --scope global|project flag")
}

type CliOptions = Omit<FrameworkOptions, "scope"> & { scope?: Scope }

function parseArgs(argv: string[]): { command: string; options: CliOptions } {
  const [command = "install", ...rest] = argv
  const force = rest.includes("--force")
  const scopeIndex = rest.findIndex((entry) => entry === "--scope")
  const scope = command === "scopes" ? undefined : parseScope(scopeIndex >= 0 ? rest[scopeIndex + 1] : undefined)

  return {
    command,
    options: {
      scope,
      force,
    },
  }
}

function renderReport(report: FrameworkReport): string {
  const lines = [
    `Action: ${report.action}`,
    `Scope: ${report.scope}`,
    `Config dir: ${report.configDir}`,
    `Project root: ${report.projectRoot}`,
    `Package version: ${report.packageVersion}`,
    `Restart required: ${report.restartRequired ? "yes" : "no"}`,
    "",
    "Items:",
  ]

  for (const item of report.items) {
    lines.push(`- [${item.status}] ${item.name}${item.detail ? `: ${item.detail}` : ""}`)
  }

  lines.push("", "MCP:")
  for (const diagnostic of report.mcp) {
    lines.push(`- [${diagnostic.status}] ${diagnostic.name}${diagnostic.detail ? `: ${diagnostic.detail}` : ""}`)
  }

  return `${lines.join("\n")}\n`
}

export async function runCli(argv = process.argv.slice(2)): Promise<number> {
  const { command, options } = parseArgs(argv)

  const requireScope = (): FrameworkOptions => {
    if (!options.scope) {
      throw new Error("Missing required --scope global|project flag")
    }

    return options as FrameworkOptions
  }

  let report: FrameworkReport
  switch (command) {
    case "install":
      report = await installFramework(requireScope())
      break
    case "status":
      report = await statusFramework(requireScope())
      break
    case "update":
      report = await updateFramework(requireScope())
      break
    case "uninstall":
      report = await uninstallFramework(requireScope())
      break
    case "scopes": {
      const scopes = await detectFrameworkScopes(options)
      process.stdout.write(`${JSON.stringify(scopes, null, 2)}\n`)
      return 0
    }
    default:
      throw new Error(
        "Usage: super-opencode-framework <install|status|update|uninstall> --scope <global|project> [--force]",
      )
  }

  process.stdout.write(renderReport(report))
  return report.items.some((item) => item.status === "conflict/manual action required") ? 2 : 0
}

const isDirectCliExecution = process.argv[1]
  ? path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1])
  : false

if (isDirectCliExecution) {
  runCli().then(
    (code) => {
      process.exitCode = code
    },
    (error: unknown) => {
      const message = error instanceof Error ? error.stack ?? error.message : String(error)
      process.stderr.write(`${message}\n`)
      process.exitCode = 1
    },
  )
}
