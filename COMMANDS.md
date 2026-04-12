# Command Reference

Super OpenCode currently ships 28 `/sc-*` commands as reusable markdown command assets for OpenCode.

These commands are designed to preserve clear boundaries while still allowing flexible routing. A command may recommend another command, load a skill, or route to a specialist agent when that improves execution quality.

## Design Rules

- Planning commands should stop at plans.
- Implementation commands should execute changes.
- Diagnostic commands should investigate without silently fixing by default.
- Recommendation and routing commands should guide, not hard-code a rigid workflow.

## Workflow Commands

| Command | Purpose |
|---|---|
| `/sc-brainstorm` | Explore an idea space and turn vague requests into concrete options. |
| `/sc-design` | Produce a structured design for a feature, system, or change. |
| `/sc-implement` | Implement a feature or change end to end. |

## Diagnostic Commands

| Command | Purpose |
|---|---|
| `/sc-analyze` | Analyze code, architecture, or behavior without changing it. |
| `/sc-troubleshoot` | Investigate a failure, bug, or unexpected behavior. |

## Quality Commands

| Command | Purpose |
|---|---|
| `/sc-test` | Design or run validation and testing workflows. |
| `/sc-document` | Produce or update documentation. |
| `/sc-improve` | Improve code quality with a pragmatic refactoring lens. |
| `/sc-cleanup` | Remove dead code, stale imports, or other low-risk clutter. |

## Research Commands

| Command | Purpose |
|---|---|
| `/sc-research` | Run deeper research before making a decision. |
| `/sc-explain` | Explain code, concepts, or system behavior. |
| `/sc-estimate` | Estimate scope, effort, or implementation cost. |

## Orchestration Commands

| Command | Purpose |
|---|---|
| `/sc-task` | Structure a complex task into tracked steps. |
| `/sc-workflow` | Produce an execution workflow or implementation plan only. |
| `/sc-agent` | Select the most relevant agent or agent set. |
| `/sc-spawn` | Break down larger initiatives into delegated work units. |

## Project And Context Commands

| Command | Purpose |
|---|---|
| `/sc-pm` | Manage project context and session continuity. |
| `/sc-recommend` | Recommend the best command flow for a request. |
| `/sc-business-panel` | Run a business-oriented multi-expert discussion. |

## Persistence Commands

| Command | Purpose |
|---|---|
| `/sc-save` | Save session state and checkpoint context. |
| `/sc-load` | Restore a saved session. |
| `/sc-reflect` | Reflect on progress, decisions, or next actions. |

## Index Commands

| Command | Purpose |
|---|---|
| `/sc-index` | Build or refresh a project index. |
| `/sc-index-repo` | Index the repository structure at a broader level. |

## Utility Commands

| Command | Purpose |
|---|---|
| `/sc-build` | Run a build-oriented workflow. |
| `/sc-git` | Execute git-oriented workflows with framework guidance. |
| `/sc-select-tool` | Recommend the best MCP or tool path for a task. |

## System Command

| Command | Purpose |
|---|---|
| `/sc-help` | Show available commands and usage guidance. |

## Routing Notes

- Many commands use the lightweight `build` router as an entry point.
- That is intentional: routing can stay dynamic instead of forcing a fixed agent per command.
- When continuity matters, `pm-agent` is the preferred specialist.
- When a domain specialist is clearly better, the command can route there.

## Skills In Use

The shipped mode skills are:

- `sc-brainstorming`
- `sc-introspection`
- `sc-deep-research`
- `sc-task-management`
- `sc-orchestration`
- `sc-token-efficiency`

Commands can load these skills when they materially improve execution quality.

## See Also

- `USAGE.md` for practical usage patterns
- `ARCHITECTURE.md` for the command-agent-skill-plugin model
- `.opencode/commands/` for the source command definitions bundled by the package
