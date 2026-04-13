# Architecture

## Overview

Super OpenCode is a bi-target npm-installable OpenCode plugin package.

It packages:

- a server runtime plugin for hooks
- a TUI plugin for Plugin Manager visibility, bootstrap UI, and diagnostics
- a shared manifest-driven bootstrap engine
- bundled command prompts, agent prompts, mode skills, and instruction files

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

The runtime plugin is published through the npm package `./server` target.

The local repo also keeps `.opencode/plugins/` wrappers for self-hosting during framework development, but the installer does not copy those plugin source files into user projects by default.

The runtime layer provides:

- persistence guidance
- command hints
- compaction/checkpoint hints
- shared runtime glue
- duplicate-load protection so hooks stay single-active even if npm and local plugin copies coexist

### TUI Layer

The TUI target is published through `./tui`.

It is responsible for:

- Plugin Manager visibility
- first-load bootstrap prompting
- scope selection (`global` or `project`)
- install/status/update/uninstall UI
- final bootstrap reporting

### Bootstrap Layer

The shared bootstrap engine is the product-critical layer for installation correctness.

It is manifest-driven and used by:

- the npm TUI plugin
- the CLI entrypoint
- future maintenance flows

It handles:

- scope resolution
- asset sync for commands, agents, skills, and instructions
- `opencode.json` merge for plugin, instructions, and MCP config
- `tui.json` merge for TUI plugin registration
- MCP prerequisite diagnostics
- managed-file hashes for idempotent update and safe uninstall

### MCP Layer

Configured through `opencode.json` in the chosen scope.

Current policy:

- `serena`: enabled only when `uvx` is available
- `context7`: enabled only when `CONTEXT7_API_KEY` is present
- `sequential`: enabled only when `npx` is available
- `playwright`: enabled only when `npx` is available
- `chrome-devtools`: enabled only when `npx` is available
- `tavily`: enabled only when `npx` and `TAVILY_API_KEY` are present
- `morph`: enabled only when `npx` and `MORPH_API_KEY` are present

Super OpenCode is designed to degrade gracefully when optional MCPs are absent. Serena is the main exception because it underpins the intended persistence model.

## Published Package Surface

The npm package publishes:

- `./server`
- `./tui`
- the shared bootstrap engine
- `framework.manifest.json`
- `.opencode/commands/**/*.md`
- `.opencode/agents/**/*.md`
- `.opencode/skills/**/SKILL.md`
- `.opencode/examples/*.json`
- `.opencode/instructions/*.md`
- the CLI wrapper and package metadata

Repo-internal planning and memory files are not part of the public package contract.

## Runtime Contract

- Node.js 24+
- Bun 1.3.9+
- OpenCode

The public contract is now explicit: the package ships an OpenCode server plugin, an OpenCode TUI plugin, and a bootstrap engine that materializes the framework assets into either global or project scope.

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
