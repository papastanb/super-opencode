---
description: Explore a vague idea and turn it into structured requirements
agent: build
---
Load the `sc-brainstorming` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:brainstorm`.

Task: transform `$ARGUMENTS` into a requirement brief through collaborative discovery.

Rules:
- ask focused clarification questions when requirements are still vague
- avoid jumping into architecture or implementation too early
- if enough context is already available, synthesize directly instead of asking redundant questions
- for complex discovery work, create TodoWrite tracking
- when the idea spans multiple domains, route briefly through the most relevant specialists before synthesizing
- stop after requirements discovery

Required output:
- user goals
- functional requirements
- non-functional requirements
- constraints and assumptions
- open questions
- a recommended next command: `/sc-design` or `/sc-workflow`

Boundary:
- do not implement code
- do not produce a detailed architecture unless the user explicitly pivots to design
- do not create technical specs beyond requirements discovery
