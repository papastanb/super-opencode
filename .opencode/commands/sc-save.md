---
description: Persist current session state, checkpoints, and next actions into Serena
agent: build
---
Load the `sc-task-management` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:save`.

Save the current session state for `$ARGUMENTS`.

Behavior:
- analyze the current session state, discoveries, progress, blockers, and next actions
- use Serena as the primary persistence layer
- write at minimum `last_session`, `next_actions`, and `pm_context`
- write `checkpoint` when the work is long, risky, or paused mid-flight
- update `summary`, `decision`, or `learning/*` only when there is meaningful new information
- keep any file-based documentation limited to durable, public project docs rather than session scratch files

Preferred Serena tools:
- `write_memory`
- `read_memory`
- `list_memories`

If richer Serena analysis helpers are unavailable, use the available memory tools plus normal agent reasoning.

Output:
- saved keys
- checkpoint status
- next resume path

Boundary:
- do not silently overwrite useful context without preserving the current recovery path
