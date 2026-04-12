---
description: Execute a complex discrete task with structured coordination
agent: build
---
Load the `sc-task-management` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:task`.

Execute `$ARGUMENTS` as a bounded task.

Rules:
- break the work into TodoWrite items when complexity justifies it
- coordinate specialists only when multiple domains are involved
- stop when the requested task is complete
- do not continue into adjacent backlog items without user input
- preserve bounded scope even when related follow-up work is obvious

Deliver:
- what was completed
- files changed
- validations run
- remaining risks or follow-ups
- next recommended command only if it is a natural continuation
