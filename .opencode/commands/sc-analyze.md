---
description: Analyze code quality, security, performance, or architecture
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:analyze`.

Analyze `$ARGUMENTS`.

Behavior:
- determine whether the focus is quality, security, performance, or architecture
- inspect the smallest relevant scope first, then widen only if needed
- prioritize findings by severity and impact
- provide concrete evidence with file paths
- keep the response diagnostic rather than prescriptive until evidence is established

Output:
- findings first
- open questions or assumptions second
- remediation guidance last
- include severity or impact language for each important finding

Boundary:
- do not edit files unless the user explicitly asks for fixes after analysis
