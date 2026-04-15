import type { Hooks } from "@opencode-ai/plugin"

import { autoCheckpointHint, commandPersistenceHint, persistenceContract } from "./memory.js"

const persistenceCommands = new Set(["sc-pm", "sc-save", "sc-load", "sc-reflect"])
// Checkpoint hints target longer-running execution commands rather than planning/persistence commands.
const checkpointCommands = new Set(["sc-implement", "sc-build", "sc-test", "sc-document", "sc-task"])

type TextLikePart = {
  id?: string
  text?: string
  [key: string]: unknown
}

function hasTextPart(parts: unknown[], id: string, text: string): boolean {
  return parts.some((part) => {
    if (!part || typeof part !== "object") {
      return false
    }

    const candidate = part as TextLikePart
    return candidate.id === id || candidate.text === text
  })
}

function pushUniquePart(parts: unknown[], part: TextLikePart & { text: string }): void {
  if (!hasTextPart(parts, part.id ?? "", part.text)) {
    parts.push(part)
  }
}

function pushUniqueText(lines: string[], value: string): void {
  if (!lines.includes(value)) {
    lines.push(value)
  }
}

/** Creates command hooks that inject persistence and checkpoint guidance without duplicate parts. */
export const createCommandHooks = (): Hooks => ({
  "command.execute.before": async (input, output) => {
    const normalized = (input.command ?? "").replace(/^\//, "")

    if (persistenceCommands.has(normalized)) {
      pushUniquePart(output.parts, {
        id: "super-opencode-persistence-hint",
        sessionID: input.sessionID,
        messageID: "",
        type: "text",
        text: commandPersistenceHint,
      })
    }

    if (checkpointCommands.has(normalized)) {
      pushUniquePart(output.parts, {
        id: "super-opencode-checkpoint-hint",
        sessionID: input.sessionID,
        messageID: "",
        type: "text",
        text: "Consider using `/sc-save` to create a checkpoint before proceeding with long operations.",
      })
    }
  },
})

/** Creates system hooks that inject the framework persistence contract exactly once. */
export const createSystemHooks = (): Hooks => ({
  "experimental.chat.system.transform": async (_input, output) => {
    pushUniqueText(output.system, persistenceContract)
  },
})

/** Creates compaction hooks that preserve framework memory guidance across compaction. */
export const createCompactionHooks = (worktree: string): Hooks => ({
  "experimental.session.compacting": async (_input, output) => {
    pushUniqueText(
      output.context,
      ["## Super OpenCode Memory", `Worktree: ${worktree}`, autoCheckpointHint, persistenceContract].join("\n"),
    )
  },
})
