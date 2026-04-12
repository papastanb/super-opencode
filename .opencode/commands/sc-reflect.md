---
description: Reflect on task adherence, completeness, and readiness using Serena tools
agent: build
---
Load the `sc-introspection` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:reflect`.

Reflect on `$ARGUMENTS`.

Behavior:
- use Serena reflection tools when available
- evaluate whether the work followed the intended plan and constraints
- identify missing information, remaining work, and whether the task is truly done
- write back only the useful conclusions to Serena memory when they improve future continuity
- promote conclusions into `docs/memory/` only when they are durable, checkpoint-worthy, or needed for human-readable handoff

Preferred Serena tools:
- `list_memories`
- `read_memory`
- `write_memory`

If reflection-specific Serena tools are exposed, use them. Otherwise, reflect using the available Serena memory tools plus normal agent reasoning.

Output:
- adherence assessment
- information gaps
- completion assessment
- recommended next action

Boundary:
- reflection and validation only
- do not start unrelated implementation from the reflection result
