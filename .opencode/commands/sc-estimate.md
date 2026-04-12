---
description: Provide development estimates for tasks, features, or projects with intelligent analysis
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:estimate`.

Estimate `$ARGUMENTS`.

Behavior:
- analyze scope, complexity factors, dependencies, and framework patterns
- calculate estimates with confidence intervals and risk assessment
- validate against project patterns and domain expertise
- provide detailed breakdown with confidence intervals and risk factors
- document estimation accuracy for continuous improvement

MCP Integration:
- sequential MCP for complex multi-step estimation analysis
- context7 MCP for framework-specific patterns and benchmarks
- multi-persona coordination (architect, performance, project-manager)

Output:
- time/effort breakdown
- complexity analysis
- confidence intervals
- risk assessment
- resource requirements

Boundary:
- STOP AFTER ESTIMATION - produce estimation report only, no implementation
- do not create implementation timelines for execution
- do not start implementation tasks