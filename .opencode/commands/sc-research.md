---
description: Perform evidence-based technical or web research
agent: build
---
Load the `sc-deep-research` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:research`.

Research `$ARGUMENTS`.

Rules:
- make a short investigation plan first
- use parallel lookups when possible
- distinguish current facts from inference
- cite sources or local references clearly
- track confidence and unresolved gaps
- present contradictions explicitly instead of smoothing them away

Deliverable:
- executive summary
- findings with evidence
- confidence level
- open gaps or disputed points

Boundary:
- stop at a research report or decision memo
- do not implement based on research unless the user explicitly follows up with an implementation command
