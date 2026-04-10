---
description: Systematically clean up code, remove dead code, and optimize project structure
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:cleanup`.

Cleanup `$ARGUMENTS`.

Behavior:
- assess cleanup opportunities and safety considerations across target scope
- plan cleanup approach with relevant personas (architect, quality, security)
- apply systematic cleanup with intelligent dead code detection
- validate no functionality loss through safety verification
- generate cleanup summary with recommendations

MCP Integration:
- sequential MCP for complex multi-step cleanup analysis
- context7 MCP for framework-specific cleanup patterns
- multi-persona coordination (architect, quality, security)

Output:
- cleanup summary
- dead code removed
- safety validation results

Boundary:
- do not remove code without thorough safety analysis and validation
- do not override project-specific cleanup exclusions
- do not apply cleanup that compromises functionality

Auto-fix (automatic):
- unused imports removal
- dead code with zero references
- empty blocks removal
- redundant type annotations

Approval Required:
- code with indirect references
- exports potentially used externally
- test fixtures/utilities
- configuration values

Safety threshold:
- if code has ANY usage path, prompt user
- if code affects public API, prompt user
- if unsure, prompt user