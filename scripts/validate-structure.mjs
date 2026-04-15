import { existsSync } from "node:fs"

const requiredPaths = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "opencode.json",
  "package.json",
  "tsconfig.json",
  "framework.manifest.json",
  "src/server.ts",
  "src/tui.ts",
  ".opencode/plugins/super-opencode.ts",
  ".opencode/commands",
  ".opencode/agents",
  ".opencode/skills",
  ".opencode/instructions/opencode-core.md",
]

const missing = requiredPaths.filter((path) => !existsSync(path))

if (missing.length > 0) {
  console.error("Missing required paths:\n" + missing.map((path) => `- ${path}`).join("\n"))
  process.exit(1)
}

console.log("Structure validation passed.")
