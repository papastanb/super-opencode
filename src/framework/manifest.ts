import { readFile } from "node:fs/promises"
import path from "node:path"

import { findPackageRoot } from "./package-root.js"
import type { FrameworkManifest } from "./types.js"

let cachedManifestPromise: Promise<FrameworkManifest> | undefined

export async function loadFrameworkManifest(): Promise<FrameworkManifest> {
  if (cachedManifestPromise) {
    return cachedManifestPromise
  }

  cachedManifestPromise = (async () => {
    try {
      const packageRoot = findPackageRoot(import.meta.url)
      const manifestPath = path.join(packageRoot, "framework.manifest.json")
      const rawManifest = await readFile(manifestPath, "utf8")
      return JSON.parse(rawManifest) as FrameworkManifest
    } catch (error) {
      cachedManifestPromise = undefined
      throw error
    }
  })()

  return cachedManifestPromise
}
