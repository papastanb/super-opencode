---
description: Meta-system task orchestration with intelligent breakdown and delegation
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:spawn`.

Spawn `$ARGUMENTS`.

Behavior:
- parse complex operation requirements and assess scope across domains
- decompose operation into coordinated subtask hierarchies (Epic → Story → Task → Subtask)
- execute tasks using optimal coordination strategy (parallel/sequential/adaptive)
- track progress across task hierarchies with dependency management
- aggregate results and provide comprehensive orchestration summary

Coordination strategies:
- sequential: dependency-ordered execution
- parallel: independent tasks execute simultaneously
- adaptive: dynamic strategy selection based on operation characteristics

Output:
- task hierarchy breakdown
- delegation assignments (which `/sc:*` command handles each task)
- coordination strategy
- dependencies and resource requirements

Boundary:
- STOP AFTER TASK DECOMPOSITION - produces task hierarchy only, delegates execution
- do not execute implementation tasks directly
- do not replace domain-specific commands for simple operations
- do not execute without proper dependency analysis

Next step: execute individual tasks using delegated commands (`/sc:implement`, `/sc:design`, `/sc:test`, etc.)
