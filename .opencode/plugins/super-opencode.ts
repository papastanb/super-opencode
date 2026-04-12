import type { Plugin } from "@opencode-ai/plugin"
import { createCommandHooks } from "./super-opencode/commands.js"
import { createCompactionHooks } from "./super-opencode/compaction.js"
import { createSystemHooks } from "./super-opencode/system.js"

export const SuperOpenCodePlugin: Plugin = async ({ client, worktree }) => {
  await client.app.log({
    body: {
      service: "super-opencode",
      level: "info",
      message: "Super OpenCode plugin initialized",
    },
  })

  return {
    ...createSystemHooks(),
    ...createCommandHooks(),
    ...createCompactionHooks(worktree),
  }
}
