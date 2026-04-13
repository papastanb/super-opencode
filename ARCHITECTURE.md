# Architecture

## Overview

Super OpenCode is an installable scaffold for OpenCode projects.

It packages a set of command prompts, agent prompts, mode skills, and a local plugin layer that together port key SuperClaude workflow ideas into the OpenCode ecosystem.

At runtime, the high-level flow is:

```text
User request
  -> /sc-* command
  -> optional routing to an agent or skill
  -> optional MCP usage
  -> plugin hooks for guidance and persistence hints
```

## Main Layers

### Instruction Layer

Defines repo and framework behavior.

- `AGENTS.md`
- `.opencode/instructions/opencode-core.md`

### Command Layer

Lives in `.opencode/commands/`.

This is the primary user-facing surface. Commands define boundaries such as plan-only, diagnose-only, or execute changes.

The command layer is intentionally not a rigid one-command-per-intent router. Some commands enter through a generic `build` agent and then route more precisely from there.

### Agent Layer

Lives in `.opencode/agents/`.

These prompts represent specialist viewpoints such as architecture, performance, quality, security, root-cause analysis, research, and project management.

`pm-agent` is the continuity specialist and is the preferred agent when session state, progress tracking, or documentation continuity matters.

### Skill Layer

Lives in `.opencode/skills/`.

Current packaged skills:

- `sc-brainstorming`
- `sc-introspection`
- `sc-deep-research`
- `sc-task-management`
- `sc-orchestration`
- `sc-token-efficiency`

These provide minimal but explicit support for the corresponding SuperClaude-inspired modes.

### Plugin Layer

Lives in `.opencode/plugins/`.

The plugin layer provides local behavior for:

- persistence guidance
- command hints
- compaction/checkpoint hints
- shared runtime glue

This is part of the scaffolded OpenCode project contract, not just internal repo code.

### MCP Layer

Configured through `opencode.json` in the consuming project.

Expected strategy:

- `serena`: required for the full persistence workflow
- `context7`: recommended
- `sequential`: recommended
- `playwright`, `chrome-devtools`, `tavily`, `morph`: optional

Super OpenCode is designed to degrade gracefully when optional MCPs are absent. Serena is the main exception because it underpins the intended persistence model.

## Published Package Surface

The npm package is designed to scaffold the runtime assets a consuming OpenCode project needs:

- `.opencode/commands/**/*.md`
- `.opencode/agents/**/*.md`
- `.opencode/skills/**/SKILL.md`
- `.opencode/plugins/**/*.ts`
- `.opencode/examples/*.json`
- `.opencode/instructions/*.md`
- installer script and package metadata

Repo-internal planning and memory files are not part of the public package contract.

## Runtime Contract

- Node.js 24+
- Bun 1.3.9+
- OpenCode

The public contract is intentionally modest: the package ships OpenCode scaffold assets plus a local plugin layer, and does not rely on a standalone executable runtime of its own.

## Design Principles

- preserve command boundaries
- prefer OpenCode-native primitives before extra plugin logic
- route dynamically when that improves outcomes
- keep Serena as the persistence source of truth when available
- keep public package behavior separate from repo-only planning state

## Repository Layout

```text
super-opencode/
  .opencode/
    commands/
    agents/
    skills/
    plugins/
    examples/
    instructions/
  scripts/
  tests/
  package.json
  opencode.json
```

## Validation

The current release-oriented checks are:

```bash
bun run check
bun test
bun run release:check
```

`bun run release:check` is the package integrity gate because it rebuilds the package and validates the published surface.
