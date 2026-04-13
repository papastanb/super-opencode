# Super OpenCode Core Instructions

## Purpose

This file carries the OpenCode-specific behavioral layer for the Super OpenCode project.

The behavioral source to interpret and port is the upstream SuperClaude framework plus its public documentation.

## Execution Rules

- Prefer OpenCode-native primitives before adding plugin logic.
- Port intent and workflow value first, not a word-for-word clone of upstream prompts.
- Keep the framework pragmatic: clear commands, focused agents, minimal mode skills, and documented MCP expectations.
- Respect command boundaries. Planning commands stop at plans, research commands stop at reports, diagnostic commands do not fix by default.
- For complex work, create and maintain TodoWrite state.
- For repo exploration, prefer `glob`, `grep`, `read`, `explore`, and local references before speculation.

## Tooling Directive

- Use the smallest relevant set of skills, subagents, MCPs, and tool options or flags that materially improves execution quality.
- Load process skills first when they apply, then load domain or implementation skills.
- Use MCPs whenever they add meaningful gains in validation, official documentation, exploration, reasoning, persistence, or release confidence.
- Use options, modes, and flags when they improve reliability or clarity, not decoratively.
- If a preferred skill or MCP is unavailable, state the degradation explicitly and use the best available fallback.
- For complex tasks, combine exploration, official documentation, structured reasoning, persistence, validation, and synthesis proactively when useful.
- Prefer precision, traceability, and robustness over a superficially minimal workflow.

## Command Family

The first command family is exposed as `/sc-*`.

Primary commands:

- `/sc-brainstorm`
- `/sc-design`
- `/sc-implement`
- `/sc-analyze`
- `/sc-troubleshoot`
- `/sc-test`
- `/sc-document`
- `/sc-research`
- `/sc-task`
- `/sc-workflow`
- `/sc-agent`

## Agent Layer

Use the dedicated `.opencode/agents/` prompts as the OpenCode translation of upstream personas.

- Route to the smallest relevant specialist set.
- Use multi-agent coordination only when the task truly spans domains.
- Include `pm-agent` when session state, progress tracking, or continuity matters.

## Mode Support

The framework provides minimal support for upstream-inspired modes through `.opencode/skills/`.

- brainstorming
- task management
- orchestration
- introspection
- token efficiency
- deep research

Load the relevant skill before acting when a mode clearly applies.

## MCP Strategy

The MCP configuration in `opencode.json` is the active integration surface.

- `context7`, `sequential`, `playwright`, `chrome-devtools` are recommended when available.
- `tavily` is recommended for research workflows when an API key exists.
- `serena` is the persistence source of truth for this framework.
- `morph` remains optional.
- If an MCP is unavailable, continue with native tools and note the degradation explicitly.

## Persistence

- Use Serena memory as the source of truth for session continuity.
- If Serena is unavailable, state clearly that the session is operating in degraded persistence mode.
