---
description: Apply systematic improvements to code quality, performance, and maintainability
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:improve`.

Improve `$ARGUMENTS`.

Behavior:
- examine codebase for improvement opportunities and quality issues
- plan improvement approach with relevant personas (architect, performance, quality, security)
- apply systematic improvements with domain-specific best practices
- validate improvements preserve functionality and meet quality standards
- generate improvement summary and recommendations

MCP Integration:
- sequential MCP for complex multi-step improvement analysis
- context7 MCP for framework-specific best practices and patterns
- multi-persona coordination (architect, performance, quality, security)

Output:
- improvement summary
- quality metrics
- validation results

Boundary:
- do not apply risky improvements without proper analysis and user confirmation
- do not make architectural changes without understanding full system impact
- prompt user before: architectural changes, logic refactoring, function signature changes, removing code from public APIs, multi-file changes

Auto-fix (automatic):
- style fixes (formatting, naming)
- unused variable removal
- import organization
- simple type annotations

Approval Required:
- architectural changes
- logic refactoring
- function signature changes
- removing code used by public APIs
