import { randomUUID } from "node:crypto"
import { mkdir, rename, rm, writeFile } from "node:fs/promises"
import path from "node:path"

/** Writes text atomically via temp file + rename to avoid partial config/state files. */
export async function writeTextAtomically(filePath: string, content: string): Promise<void> {
  await mkdir(path.dirname(filePath), { recursive: true })
  const tempPath = `${filePath}.${randomUUID()}.tmp`
  await writeFile(tempPath, content, "utf8")

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
