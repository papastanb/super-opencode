---
description: Route work to the most relevant specialist agent or agent set
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:agent`.

For `$ARGUMENTS`, determine the most relevant agent or small agent set from `.opencode/agents/`.

Behavior:
- explain the chosen routing briefly
- prefer a single specialist when possible
- escalate to multiple agents only for cross-domain work
- include `pm-agent` when continuity, progress, or documentation is central
- mention why the chosen agent set is better than the obvious alternatives when the routing is non-trivial

If the user already named an agent, honor it unless clearly mismatched.
