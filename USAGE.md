# Usage Guide

Super OpenCode is intended to be installed into an existing OpenCode project.

## Start OpenCode

```bash
opencode
```

## First Commands To Know

```bash
/sc-help
/sc-recommend "I need to debug a failing release workflow"
/sc-pm
```

Use `/sc-recommend` when you want the framework to choose a good path instead of forcing a fixed command sequence.

## Common Usage Patterns

### Explore A New Problem

```bash
/sc-brainstorm "ways to add tenant-aware billing"
/sc-design "tenant-aware billing model"
```

### Implement A Change

```bash
/sc-implement "add tenant-aware billing"
/sc-test "validate tenant-aware billing"
```

### Investigate A Bug

```bash
/sc-troubleshoot "checkout fails after login refresh"
/sc-analyze "auth and checkout interaction"
```

### Work From A Complex Goal

```bash
/sc-workflow "migrate the plugin packaging flow"
/sc-task "track the migration work"
```

`/sc-workflow` plans only. `/sc-task` helps structure execution. `/sc-implement` is the command that should actually make code changes.

## Agents And Routing

You can ask the framework to route dynamically:

```bash
/sc-agent "who should review our persistence approach?"
```

Or call for a recommendation first:

```bash
/sc-recommend "I need to document and validate a new installer flow"
```

Super OpenCode intentionally preserves flexible routing. Not every request should map to a single fixed `/sc-*` command.

## Persistence Workflow

Super OpenCode is Serena-first for persistence when Serena is available.

```bash
/sc-save
/sc-load
/sc-reflect
```

Typical uses:

- `/sc-save` before a major refactor or compaction
- `/sc-load` when resuming a prior session
- `/sc-reflect` to summarize current progress and next actions

## MCP Expectations

- `serena`: required for the full persistence workflow
- `context7`: recommended for official documentation lookup
- `sequential`: recommended for structured reasoning
- `playwright`, `chrome-devtools`, `tavily`, `morph`: optional and task-dependent

If Serena is unavailable, Super OpenCode can still operate in a degraded mode, but session continuity will be weaker.

## Practical Tips

- Start with `/sc-recommend` when the right path is unclear.
- Use `/sc-workflow` for plans and `/sc-implement` for execution.
- Use `/sc-troubleshoot` when the main need is diagnosis rather than code changes.
- Use `/sc-document` whenever behavior changes would otherwise be opaque.
- Use `/sc-save` before context-heavy milestones.

## Related Docs

- `INSTALL.md` for installation details
- `COMMANDS.md` for the command catalog
- `ARCHITECTURE.md` for how commands, agents, skills, and plugins fit together
