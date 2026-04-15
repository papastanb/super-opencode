# Project Index

Compact repository index for fast orientation. Existing hand-written docs remain the authoritative long-form references.

## Snapshot

| Item | Value |
|---|---|
| Package | `super-opencode-framework` |
| Version | `1.0.1` |
| Language | TypeScript (`module: NodeNext`) |
| Package targets | `./server`, `./tui`, CLI bin |
| Core product shape | OpenCode plugin runtime + TUI plugin + manifest-driven bootstrap engine |
| Shipped framework assets | 28 commands, 15 agents, 6 skills |
| Test files | 2 (`33` test cases) |

## README Summary

Super OpenCode packages the SuperClaude-style `/sc-*` workflow layer as an npm-installable OpenCode plugin. The repository centers on a shared bootstrap engine that syncs command, agent, skill, and instruction assets into either project or global scope, while the runtime plugin adds persistence guidance and hook behavior.

## Entry Points

| Path | Role |
|---|---|
| [`src/server.ts`](src/server.ts) | Server plugin entrypoint. Exports the default plugin module and `SuperOpenCodePlugin`. |
| [`src/tui.ts`](src/tui.ts) | TUI plugin entrypoint. Exposes install, status, update, and uninstall actions through OpenCode UI dialogs. |
| [`scripts/install-project.mjs`](scripts/install-project.mjs) | CLI shim used by the published bin. Loads `dist/src/cli.js` and forwards argv. |
| [`src/cli.ts`](src/cli.ts) | CLI command parser and report renderer for `install`, `status`, `update`, `uninstall`, and `scopes`. |

## Structure Overview

| Area | Purpose | Key Files |
|---|---|---|
| [`src/framework/`](src/framework) | Bootstrap engine, manifest loading, config patching, scope resolution, install-state handling, MCP diagnostics | `engine.ts`, `config.ts`, `manifest.ts`, `prerequisites.ts`, `state.ts`, `paths.ts` |
| [`src/runtime/`](src/runtime) | Runtime hooks, persistence guidance, duplicate-load protection | `plugin.ts`, `hooks.ts`, `memory.ts` |
| [`src/`](src) | Public package entrypoints | `server.ts`, `tui.ts`, `cli.ts` |
| [`.opencode/commands/`](.opencode/commands) | User-facing `/sc-*` command assets | 28 markdown command definitions |
| [`.opencode/agents/`](.opencode/agents) | Specialist agent prompts | 15 agent definitions |
| [`.opencode/skills/`](.opencode/skills) | Mode and process skills | 6 packaged skills |
| [`.opencode/instructions/`](.opencode/instructions) | OpenCode-specific behavioral layer | `opencode-core.md` |
| [`tests/`](tests) | Bootstrap and runtime regression coverage | `framework.test.mjs`, `plugin-hooks.test.mjs` |
| [`scripts/`](scripts) | Package validation and CLI wrapper scripts | `install-project.mjs`, `validate-package.mjs`, `validate-structure.mjs`, `validate-cross-platform.mjs` |

## Top-Level Map

| Path | Kind | Notes |
|---|---|---|
| `.github/workflows/` | automation | CI and npm publish workflows |
| `.opencode/` | framework assets | Commands, agents, skills, instructions, examples, local dev helpers |
| `src/` | source | Plugin runtime, TUI, CLI, bootstrap engine |
| `scripts/` | tooling | Validation and published CLI shim |
| `tests/` | validation | Bun-based regression coverage |
| `dist/` | generated | Build output, not primary source of truth |
| `node_modules/` | generated | Installed dependencies |

## Workflow Assets

| Area | Summary |
|---|---|
| Commands | 28 `/sc-*` command prompts in [`.opencode/commands/`](.opencode/commands) |
| Agents | 15 specialist prompts in [`.opencode/agents/`](.opencode/agents) |
| Skills | 6 packaged skills in [`.opencode/skills/`](.opencode/skills) |
| Instructions | OpenCode runtime behavior in [`.opencode/instructions/opencode-core.md`](.opencode/instructions/opencode-core.md) |
| Example config | [`.opencode/examples/opencode.example.json`](.opencode/examples/opencode.example.json) shows a fuller reference setup |

## Docs Index

| File | Purpose |
|---|---|
| [`README.md`](README.md) | Product overview, install flow, CLI usage, MCP policy, release summary |
| [`INSTALL.md`](INSTALL.md) | Installation details and troubleshooting |
| [`USAGE.md`](USAGE.md) | Practical usage patterns and examples |
| [`COMMANDS.md`](COMMANDS.md) | `/sc-*` command reference |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Layer model, package surface, runtime flow, validation contract |
| [`CHANGELOG.md`](CHANGELOG.md) | Release history |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution and development workflow |
| [`AGENTS.md`](AGENTS.md) | Repo-specific execution rules for agents |

## API Index

### Public package surface

| Export | Source | Notes |
|---|---|---|
| package default export | [`src/server.ts`](src/server.ts) | OpenCode server plugin module with id `super-opencode-framework` |
| `SuperOpenCodePlugin` | [`src/server.ts`](src/server.ts) | Named export for runtime plugin hook registration |
| `./server` | [`package.json`](package.json) | Published target resolved to `dist/src/server.js` |
| `./tui` | [`package.json`](package.json) | Published target resolved to `dist/src/tui.js` |
| CLI bin `super-opencode-framework` | [`package.json`](package.json) | Published bin resolved through `scripts/install-project.mjs` |

### Key internal modules

| Module | Important symbols |
|---|---|
| [`src/framework/engine.ts`](src/framework/engine.ts) | `installFramework`, `statusFramework`, `updateFramework`, `uninstallFramework`, `detectFrameworkScopes` |
| [`src/framework/config.ts`](src/framework/config.ts) | `patchOpencodeConfig`, `patchTuiConfig`, `removeFrameworkConfig`, `removeFrameworkTuiConfig` |
| [`src/framework/manifest.ts`](src/framework/manifest.ts) | `loadFrameworkManifest` |
| [`src/runtime/plugin.ts`](src/runtime/plugin.ts) | `SuperOpenCodePlugin` |
| [`src/runtime/hooks.ts`](src/runtime/hooks.ts) | `createSystemHooks`, `createCommandHooks`, `createCompactionHooks` |
| [`src/cli.ts`](src/cli.ts) | `runCli` |

## Config Surfaces

| File | Role |
|---|---|
| [`package.json`](package.json) | Published package metadata, exports, bin, scripts, dependencies |
| [`framework.manifest.json`](framework.manifest.json) | Asset-group map, target locations, MCP policy definitions |
| [`opencode.json`](opencode.json) | Local framework config, instructions, watcher, MCP defaults |
| [`tui.json`](tui.json) | Local TUI plugin registration |
| [`tsconfig.json`](tsconfig.json) | Base TypeScript settings |
| [`tsconfig.build.json`](tsconfig.build.json) | Build output settings for `dist/` |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | CI validation workflow |
| [`.github/workflows/publish.yml`](.github/workflows/publish.yml) | Release/publish workflow |

## Automation

| File | Trigger | What it validates |
|---|---|---|
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | pushes and PRs to `main` | typecheck, structure validation, tests, scaffold validation, release package validation |
| [`.github/workflows/publish.yml`](.github/workflows/publish.yml) | `v*` tags | install, validate, test, `release:check`, tag/version match, npm publish |

## Scripts

| File | Role |
|---|---|
| [`scripts/install-project.mjs`](scripts/install-project.mjs) | Published bin shim that loads the built CLI |
| [`scripts/validate-structure.mjs`](scripts/validate-structure.mjs) | Structural consistency validation |
| [`scripts/validate-package.mjs`](scripts/validate-package.mjs) | Package surface validation for release checks |
| [`scripts/validate-cross-platform.mjs`](scripts/validate-cross-platform.mjs) | Scaffold/bootstrap portability validation |

## Tests

| File | Coverage focus |
|---|---|
| [`tests/framework.test.mjs`](tests/framework.test.mjs) | package targets, scoped install flows, idempotence, conflict handling, update/uninstall safety, MCP diagnostics, status reporting |
| [`tests/plugin-hooks.test.mjs`](tests/plugin-hooks.test.mjs) | persistence contract injection, hook deduplication, runtime single-registration behavior |

## Navigation Shortcuts

- Bootstrap behavior: [`src/framework/engine.ts`](src/framework/engine.ts)
- Runtime behavior: [`src/runtime/plugin.ts`](src/runtime/plugin.ts), [`src/runtime/hooks.ts`](src/runtime/hooks.ts), [`src/runtime/memory.ts`](src/runtime/memory.ts)
- Command catalog: [`COMMANDS.md`](COMMANDS.md), [`.opencode/commands/`](.opencode/commands)
- Behavior rules: [`AGENTS.md`](AGENTS.md), [`.opencode/instructions/opencode-core.md`](.opencode/instructions/opencode-core.md)
- Installation policy: [`README.md`](README.md), [`INSTALL.md`](INSTALL.md), [`framework.manifest.json`](framework.manifest.json)
- Repo automation: [`.github/workflows/ci.yml`](.github/workflows/ci.yml), [`.github/workflows/publish.yml`](.github/workflows/publish.yml), [`scripts/`](scripts)

## Alignment Notes

- This index is additive and does not replace hand-written documentation.
- Runtime contract is aligned on Node.js `24+` across docs and package metadata.
