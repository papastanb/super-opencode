---
description: List available `/sc-*` commands, skills, and key usage patterns
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:help`.

For `$ARGUMENTS`, provide a concise command reference for this repo.

Behavior:
- list the available `/sc-*` commands present in `.opencode/commands/`
- summarize what each one is for and when to use it
- mention the Phase 1 mode-support skills when helpful
- keep this informational only

If the user asks a targeted help question, prioritize the relevant subset over a full dump.

Boundary:
- do not execute the recommended commands automatically
