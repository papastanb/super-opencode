import { existsSync } from "node:fs"

const requiredPaths = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "docs/PORTING_PLAN.md",
  "docs/memory/status.md",
  "docs/memory/implementation-plan-tracking.md",
  "docs/memory/sessions/active.md",
  "opencode.json",
  "package.json",
  "tsconfig.json",
  ".opencode/package.json",
  ".opencode/plugins/super-opencode.ts",
]

const missing = requiredPaths.filter((path) => !existsSync(path))

if (missing.length > 0) {
  console.error("Missing required paths:\n" + missing.map((path) => `- ${path}`).join("\n"))
  process.exit(1)
}

console.log("Structure validation passed.")
