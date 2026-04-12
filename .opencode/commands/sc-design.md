---
description: Produce architecture, API, component, or data design
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:design`.

Design a solution for `$ARGUMENTS`.

Behavior:
- inspect existing project structure first
- keep the design aligned with current architecture and constraints
- call relevant specialist agents when domain depth is needed
- favor concise design specs over verbose essays
- validate the design against scalability and maintainability concerns

Output should include as appropriate:
- architecture or component boundaries
- interfaces or contracts
- data shape or schema notes
- tradeoffs
- implementation handoff notes
- explicit assumptions and unresolved decisions

Boundary:
- stop at design and specification
- do not start implementation unless the user explicitly switches to `/sc-implement`
- do not modify architecture without user approval when the change is material
