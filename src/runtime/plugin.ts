import type { Hooks, Plugin } from "@opencode-ai/plugin"

import { createCommandHooks, createCompactionHooks, createSystemHooks } from "./hooks.js"

const runtimeLoadMarker = Symbol.for("super-opencode.runtime-loaded")

type GlobalRuntimeState = typeof globalThis & {
  [key: symbol]: boolean | undefined
}

async function safeLog(logOperation: () => Promise<unknown>): Promise<void> {
  try {
    await logOperation()
  } catch {
    // Logging should never block hook initialization.
  }
}

function mergeHooks(...hookSets: Hooks[]): Hooks {
  const merged: Hooks = {}

  for (const hookSet of hookSets) {
    for (const [key, handler] of Object.entries(hookSet)) {
      if (Object.prototype.hasOwnProperty.call(merged, key)) {
        throw new Error(`Super OpenCode hook collision for '${key}'`)
      }

      ;(merged as Record<string, unknown>)[key] = handler
    }
  }

  return merged
}

/** Creates the runtime plugin hooks and skips duplicate registration within one process. */
export const SuperOpenCodePlugin: Plugin = async ({ client, worktree }) => {
  const runtimeState = globalThis as GlobalRuntimeState
  if (runtimeState[runtimeLoadMarker]) {
    await safeLog(() =>
      client.app.log({
        body: {
          service: "super-opencode",
          level: "info",
          message: "Super OpenCode runtime already active, skipping duplicate hook registration",
        },
      }),
    )

    return createCompactionHooks(worktree)
  }

  runtimeState[runtimeLoadMarker] = true

  try {
    await safeLog(() =>
      client.app.log({
        body: {
          service: "super-opencode",
          level: "info",
          message: "Super OpenCode plugin initialized",
        },
      }),
    )

    return mergeHooks(createSystemHooks(), createCommandHooks(), createCompactionHooks(worktree))
  } catch (error) {
    delete runtimeState[runtimeLoadMarker]
    throw error
  }
}
