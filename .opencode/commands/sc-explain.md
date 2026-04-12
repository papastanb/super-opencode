---
description: Provide clear explanations of code, concepts, and system behavior with educational clarity
agent: build
---
Load the `learning-guide` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:explain`.

Explain `$ARGUMENTS`.

Behavior:
- examine target code, concept, or system for comprehensive understanding
- determine audience level and appropriate explanation depth
- structure explanation with progressive complexity and logical flow
- create clear explanations with examples and practical demonstrations
- verify explanation accuracy and educational effectiveness

MCP Integration:
- sequential MCP for complex concept breakdown
- context7 MCP for framework documentation and official patterns
- multi-persona coordination (learning-guide, system-architect, security-engineer)

Output:
- structured explanation
- examples and demonstrations
- educational progression from basic to advanced

Boundary:
- do not generate explanations without thorough analysis
- do not reveal sensitive details
- adapt depth to audience level (basic/intermediate/advanced)