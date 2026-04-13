import { readFile } from "node:fs/promises"
import path from "node:path"

import { findPackageRoot } from "./package-root.js"
import type { FrameworkManifest } from "./types.js"

let cachedManifestPromise: Promise<FrameworkManifest> | undefined

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function assertFrameworkManifest(value: unknown): asserts value is FrameworkManifest {
  if (!isStringRecord(value)) {
    throw new Error("Framework manifest must be an object")
  }

  if (typeof value.manifestVersion !== "number" || typeof value.packageName !== "string" || typeof value.pluginId !== "string") {
    throw new Error("Framework manifest is missing required top-level metadata")
  }

  if (!Array.isArray(value.assetGroups) || !isStringRecord(value.config) || !isStringRecord(value.mcp)) {
    throw new Error("Framework manifest is missing required asset, config, or MCP sections")
  }
}

/** Loads the packaged framework manifest once per process and retries after load failures. */
export async function loadFrameworkManifest(): Promise<FrameworkManifest> {
  if (cachedManifestPromise) {
    return cachedManifestPromise
  }

  cachedManifestPromise = (async () => {
    try {
      const packageRoot = findPackageRoot(import.meta.url)
      const manifestPath = path.join(packageRoot, "framework.manifest.json")
      const rawManifest = await readFile(manifestPath, "utf8")
      const parsedManifest = JSON.parse(rawManifest) as unknown
      assertFrameworkManifest(parsedManifest)
      return parsedManifest
    } catch (error) {
      cachedManifestPromise = undefined
      throw error
    }
  })()

  return cachedManifestPromise
}
