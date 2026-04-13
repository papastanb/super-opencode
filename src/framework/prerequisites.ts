import { constants } from "node:fs"
import { access } from "node:fs/promises"
import path from "node:path"

import type { FrameworkManifest, McpDiagnostic } from "./types.js"

type BinaryResolver = (binary: string, env: NodeJS.ProcessEnv) => Promise<boolean>

async function isExecutable(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.X_OK)
    return true
  } catch {
    return false
  }
}

function candidateExecutables(binary: string, env: NodeJS.ProcessEnv): string[] {
  const pathEntries = (env.PATH ?? "").split(path.delimiter).filter(Boolean)

  if (process.platform !== "win32") {
    return pathEntries.map((entry) => path.join(entry, binary))
  }

  const extensions = (env.PATHEXT ?? ".EXE;.CMD;.BAT;.COM")
    .split(";")
    .filter(Boolean)
  const hasExtension = path.extname(binary) !== ""

  return pathEntries.flatMap((entry) => {
    if (hasExtension) {
      return [path.join(entry, binary)]
    }

    return extensions.map((extension) => path.join(entry, `${binary}${extension.toLowerCase()}`))
  })
}

export const defaultBinaryResolver: BinaryResolver = async (binary, env) => {
  const candidates = candidateExecutables(binary, env)
  for (const candidate of candidates) {
    if (await isExecutable(candidate)) {
      return true
    }
  }

  return false
}

/** Evaluates MCP prerequisites and returns the effective enabled state for each MCP entry. */
export async function diagnoseMcpPolicies(
  manifest: FrameworkManifest,
  env: NodeJS.ProcessEnv,
  resolveBinary: BinaryResolver = defaultBinaryResolver,
): Promise<McpDiagnostic[]> {
  const diagnostics: McpDiagnostic[] = []

  for (const [name, policy] of Object.entries(manifest.mcp ?? {})) {
    const requiredEnv = policy.requirements?.env ?? []
    const requiredBinaries = policy.requirements?.binaries ?? []
    const missingEnv = requiredEnv.filter((variable) => env[variable] === undefined || env[variable] === "")

    const binaryChecks = await Promise.all(
      requiredBinaries.map(async (binary) => ({
        binary,
        present: await resolveBinary(binary, env),
      })),
    )
    const missingBinaries = binaryChecks.filter((entry) => !entry.present).map((entry) => entry.binary)

    let status: McpDiagnostic["status"] = "configured and enabled"
    let enabled = true
    if (policy.requirements?.manual) {
      status = "configured but requires auth/manual setup"
      enabled = false
    } else if (missingEnv.length > 0) {
      status = "configured but disabled by missing env"
      enabled = false
    } else if (missingBinaries.length > 0) {
      status = "configured but disabled by missing binary"
      enabled = false
    }

    diagnostics.push({
      name,
      status,
      enabled,
      missingEnv,
      missingBinaries,
      detail: policy.reason ?? "",
      config: {
        ...policy.config,
        enabled,
      },
    })
  }

  return diagnostics.sort((left, right) => left.name.localeCompare(right.name))
}
