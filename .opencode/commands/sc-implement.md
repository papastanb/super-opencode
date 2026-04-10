---
description: Implement a feature with pragmatic specialist routing
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:implement`.

Implement `$ARGUMENTS` end to end.

Execution rules:
- inspect the codebase and local patterns first
- choose the smallest correct change set
- route to relevant specialist agents when needed
- create TodoWrite when the task spans multiple steps or files
- run relevant validation after edits
- update project memory when the work materially changes current status or next steps
- detect whether the request is component, api, service, or feature-shaped and adapt accordingly
- integrate documentation or usage notes when the change would otherwise be opaque

Completion checklist:
- code changed
- local verification attempted
- residual risks noted
- handoff to `/sc-test` or `/sc-git` suggested when relevant

If the request is actually a plan or research task, redirect behavior to `/sc-workflow`, `/sc-brainstorm`, or `/sc-research` instead of forcing implementation.
