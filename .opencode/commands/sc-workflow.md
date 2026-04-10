---
description: Produce an implementation workflow or execution plan only
agent: build
---
Load the `sc-task-management` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:workflow`.

Create an execution workflow for `$ARGUMENTS`.

Behavior:
- analyze scope, dependencies, and sequencing
- propose phases, checkpoints, and validations
- identify where parallel execution is safe
- note required commands, agents, and MCP dependencies
- produce a plan that is executable in this repo, not a generic template

Output:
- phases
- dependencies
- execution order
- validation gates
- explicit handoff to `/sc-implement` when appropriate

Boundary:
- plan only
- do not start coding, editing, or testing unless the user explicitly pivots to execution
