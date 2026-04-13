import type { Hooks, Plugin } from "@opencode-ai/plugin"

import { createCommandHooks, createCompactionHooks, createSystemHooks } from "./hooks.js"

const runtimeLoadMarker = "__super_opencode_runtime_loaded__"

type GlobalRuntimeState = typeof globalThis & {
  [runtimeLoadMarker]?: boolean
}

function emptyHooks(): Hooks {
  return {}
}

export const SuperOpenCodePlugin: Plugin = async ({ client, worktree }) => {
  const runtimeState = globalThis as GlobalRuntimeState
  if (runtimeState[runtimeLoadMarker]) {
    await client.app.log({
      body: {
        service: "super-opencode",
        level: "info",
        message: "Super OpenCode runtime already active, skipping duplicate hook registration",
      },
    })

    return emptyHooks()
  }

  runtimeState[runtimeLoadMarker] = true

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
