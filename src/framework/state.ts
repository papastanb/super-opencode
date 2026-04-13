import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import type { FrameworkInstallState, Scope } from "./types.js"

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
    },
  }
}

export async function readInstallState(filePath: string): Promise<FrameworkInstallState | undefined> {
  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as FrameworkInstallState
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return undefined
    }

    throw error
  }
}

export async function writeInstallState(filePath: string, state: FrameworkInstallState): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(state, null, 2)}\n`, "utf8")
}

export async function removeInstallState(filePath: string): Promise<void> {
  await rm(filePath, { force: true })
}
