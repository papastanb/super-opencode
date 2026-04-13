import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

function looksLikePackageRoot(candidate: string): boolean {
  const packageJsonPath = path.join(candidate, "package.json")
  if (!existsSync(packageJsonPath)) {
    return false
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as { name?: string }
    return packageJson.name === "super-opencode-framework"
  } catch {
    return false
  }
}

export function findPackageRoot(fromUrl: string): string {
  let current = path.dirname(fileURLToPath(fromUrl))

  while (true) {
    if (looksLikePackageRoot(current)) {
      return current
    }

    const parent = path.dirname(current)
    if (parent === current) {
      throw new Error("Unable to resolve the super-opencode-framework package root")
    }

    current = parent
  }
}
