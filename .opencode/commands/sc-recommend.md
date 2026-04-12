---
description: Recommend the best `/sc-*` command flow for a user request
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:recommend`.

For `$ARGUMENTS`, recommend the most suitable command or small command sequence from this repo.

Behavior:
- infer whether the request is exploratory, design-oriented, implementation-oriented, diagnostic, research-heavy, documentation-heavy, or orchestration-heavy
- recommend the smallest effective command flow
- adapt tone and explanation depth to the user's apparent level of specificity
- when useful, include supporting agents or skills that are likely to matter

Output:
- request classification
- primary recommended command
- optional follow-up command sequence
- brief rationale

Boundary:
- recommendation only
- do not execute the flow unless the user asks to proceed
