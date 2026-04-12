---
description: Git operations with intelligent commit messages and workflow optimization
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:git`.

Git `$ARGUMENTS`.

Behavior:
- check repository state and working directory changes
- validate operation is appropriate for current Git context
- execute git commands with intelligent automation
- apply smart commit messages with conventional format
- provide clear status summaries and workflow recommendations

Output:
- operation result
- status summary
- workflow recommendations

Boundary:
- do not modify repository configuration without explicit authorization
- do not execute destructive operations without confirmation
- do not handle complex merges requiring manual intervention

Smart commit patterns:
- analyze changes → generate conventional commit message
- apply consistent branch naming conventions
- provide guided conflict resolution