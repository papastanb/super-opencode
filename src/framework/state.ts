import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

import type { FrameworkInstallState, Scope } from "./types.js"

/** Creates an empty persisted state object for a scope that has not been bootstrapped yet. */
export function createEmptyState(scope: Scope, packageVersion: string, manifestVersion: number): FrameworkInstallState {
  return {
    scope,
    manifestVersion,
    packageVersion,
    updatedAt: new Date().toISOString(),
    files: {},
    ownership: {
      createdOpencodeConfig: false,
      createdTuiConfig: false,
      addedOpencodePlugin: false,
      addedTuiPlugin: false,
      addedInstructions: [],
      addedMcpKeys: [],
      addedMcpHashes: {},
    },
  }
}

/** Backfills newer ownership fields so older persisted install states remain safe to consume. */
function normalizeInstallState(state: FrameworkInstallState): FrameworkInstallState {
  const ownership = state.ownership ?? createEmptyState(state.scope, state.packageVersion, state.manifestVersion).ownership

  return {
    ...state,
    files: state.files ?? {},
    ownership: {
      createdOpencodeConfig: ownership.createdOpencodeConfig ?? false,
      createdTuiConfig: ownership.createdTuiConfig ?? false,
      addedOpencodePlugin: ownership.addedOpencodePlugin ?? false,
      addedTuiPlugin: ownership.addedTuiPlugin ?? false,
      addedInstructions: Array.isArray(ownership.addedInstructions) ? ownership.addedInstructions : [],
      addedMcpKeys: Array.isArray(ownership.addedMcpKeys) ? ownership.addedMcpKeys : [],
      addedMcpHashes:
        ownership.addedMcpHashes && typeof ownership.addedMcpHashes === "object" && !Array.isArray(ownership.addedMcpHashes)
          ? ownership.addedMcpHashes
          : {},
    },
  }
}

/** Reads persisted framework state for the requested scope when it exists. */
export async function readInstallState(filePath: string): Promise<FrameworkInstallState | undefined> {
  try {
    const raw = await readFile(filePath, "utf8")
    return normalizeInstallState(JSON.parse(raw) as FrameworkInstallState)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined
    }

    throw error
  }
}

/** Persists the framework state used for idempotent updates and safe uninstalls. */
export async function writeInstallState(filePath: string, state: FrameworkInstallState): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.${randomUUID()}.tmp`
  await writeFile(tempPath, `${JSON.stringify(state, null, 2)}\n`, "utf8")

  try {
    await rename(tempPath, filePath)
  } catch (error) {
    if (!["EEXIST", "EPERM"].includes((error as NodeJS.ErrnoException).code ?? "")) {
      await rm(tempPath, { force: true })
      throw error
    }

    await rm(filePath, { force: true })
    try {
      await rename(tempPath, filePath)
    } catch (renameError) {
      await rm(tempPath, { force: true })
      throw renameError
    }
  }
}

/** Removes the persisted framework state file for a scope. */
export async function removeInstallState(filePath: string): Promise<void> {
  await rm(filePath, { force: true })
}
