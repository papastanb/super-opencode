---
description: Restore context, summarize progress, and orchestrate work through the PM layer
agent: build
---
Load the `sc-task-management` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:pm`.

Handle `$ARGUMENTS` through the PM layer.

Behavior:
- restore context from Serena first using `list_memories`, `read_memory("pm_context")`, `read_memory("current_plan")`, `read_memory("last_session")`, and `read_memory("next_actions")`
- summarize previous work, current progress, next actions, and blockers
- route to the smallest useful specialist set without forcing the user to name agents manually
- maintain continuity during long or multi-step tasks
- write back to Serena when the session state or execution plan becomes clearer
- keep continuity state in Serena rather than committed session notes

Use this command for:
- session resumption
- progress questions
- orchestration-heavy requests
- continuity-sensitive implementation waves

Output:
- previous
- progress
- next
- blockers
- recommended execution path

Boundary:
- do not perform unrelated implementation just because context was restored
- if Serena is unavailable, state explicitly that the command is operating in degraded mode
