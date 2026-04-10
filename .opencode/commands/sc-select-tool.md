---
description: Intelligent MCP tool selection based on complexity scoring and operation analysis
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:select-tool`.

Select-tool `$ARGUMENTS`.

Behavior:
- parse operation type, scope, file count, and complexity indicators
- apply multi-dimensional complexity scoring across operation factors
- match operation requirements against available MCP capabilities
- choose optimal tool based on scoring matrix and performance requirements
- verify selection accuracy and provide confidence metrics

MCP Integration:
- serena MCP: optimal for semantic operations, LSP functionality, symbol navigation, project context
- morph MCP: optimal for pattern-based edits, bulk transformations, speed-critical operations
- decision matrix: intelligent routing based on complexity scoring

Complexity thresholds:
- score >0.6 → Serena (semantic operations)
- score <0.4 → Morph (pattern operations)
- 0.4-0.6 → feature-based selection

Output:
- selected tool recommendation
- complexity score analysis
- confidence metrics
- rationale for selection

Boundary:
- do not override explicit tool specifications when user has clear preference
- provide sub-100ms decision time with >95% selection accuracy
- fallback: Serena → Morph → Native tools