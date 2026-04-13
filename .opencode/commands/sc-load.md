---
description: Load project context and resume state from Serena persistence
agent: build
---
Load the `sc-task-management` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:load`.

Load context for `$ARGUMENTS`.

Behavior:
- activate Serena-backed context restoration first
- use `list_memories` and `read_memory` to retrieve the latest PM state
- reconstruct the current project state from `pm_context`, `current_plan`, `last_session`, and `next_actions`
- validate the loaded context against the current repo state

Output:
- previous
- progress
- next
- blockers
- load integrity notes

Boundary:
- do not mutate project files unless the user also requested execution
