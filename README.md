# Super OpenCode

> OpenCode framework plugin package with a real post-install bootstrap for commands, agents, skills, instructions, MCP config, diagnostics, and explicit global/project scopes.

[![CI](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml/badge.svg)](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.3.9+-fff.svg?logo=bun)](https://bun.sh)
[![Node](https://img.shields.io/badge/Node-24+-339933.svg?logo=node.js)](https://nodejs.org/)

## What It Provides

- 28 `/sc-*` commands for common engineering workflows
- 15 specialist agent prompts
- 6 reusable mode skills
- An npm-installable OpenCode plugin runtime with explicit `./server` and `./tui` targets
- A manifest-driven bootstrap engine shared by the TUI, CLI, and maintenance flows
- Bundled command, agent, skill, and instruction assets with scope-aware sync
- Serena-first persistence guidance for OpenCode sessions
- Idempotent install, status, update, and uninstall commands

## Runtime Contract

- Node.js 24+
- Bun 1.3.9+
- OpenCode

## Install As An OpenCode Plugin

Primary flow from the OpenCode UI:

1. Open OpenCode.
2. Press `Ctrl+P`.
3. Open `plugins`.
4. Press `Shift+I` to install from npm.
5. Enter `super-opencode-framework`.

This installs the package and makes it visible in Plugin Manager because the package now exposes a real TUI target.

On first load, the TUI bootstrap asks you to confirm a scope:

- `project`: sync into `<repo>/.opencode`, `<repo>/opencode.json`, and `<repo>/tui.json`
- `global`: sync into `~/.config/opencode`, `~/.config/opencode/opencode.json`, and `~/.config/opencode/tui.json`

The bootstrap then:

- syncs commands, agents, skills, and instructions
- merges plugin, instructions, and MCP config without duplication
- validates MCP prerequisites and reports enabled/disabled states
- records managed file hashes so re-runs are idempotent
- avoids copying local plugin source files by default

## CLI Bootstrap

With Bun:

```bash
bun add -d super-opencode-framework
bunx super-opencode-framework install --scope project
bunx super-opencode-framework install --scope global
bunx super-opencode-framework status --scope project
bunx super-opencode-framework update --scope project
bunx super-opencode-framework uninstall --scope project
```

With npm:

```bash
npm install -D super-opencode-framework
npx super-opencode-framework install --scope project
npx super-opencode-framework install --scope global
npx super-opencode-framework status --scope project
npx super-opencode-framework update --scope project
npx super-opencode-framework uninstall --scope project
```

The CLI uses the same engine as the TUI bootstrap. The scope is always explicit and never guessed silently.

Project scope syncs these locations:

- `.opencode/commands`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/instructions/opencode-core.md`
- `opencode.json`
- `tui.json`

Global scope syncs these locations:

- `~/.config/opencode/commands`
- `~/.config/opencode/agents`
- `~/.config/opencode/skills`
- `~/.config/opencode/instructions/opencode-core.md`
- `~/.config/opencode/opencode.json`
- `~/.config/opencode/tui.json`

Project assets override global assets when both scopes are installed.

## Develop This Repository

```bash
git clone https://github.com/papastanb/super-opencode.git
cd super-opencode
bun install
bun run check
bun test
bun run release:check
```

## MCP Strategy

- `serena`: required for the full persistence workflow
- `context7`: optional, recommended for official documentation lookups
- `sequential`: optional, recommended for structured reasoning
- `playwright`, `chrome-devtools`, `tavily`, `morph`: optional, task-dependent

The bootstrap always writes MCP config for the framework set and then evaluates prerequisites.

Possible states:

- `configured and enabled`
- `configured but disabled by missing env`
- `configured but disabled by missing binary`
- `configured but requires auth/manual setup`

Current policy covers:

- `serena`
- `context7`
- `sequential`
- `playwright`
- `chrome-devtools`
- `tavily`
- `morph`

## Documentation

- [PROJECT_INDEX.md](PROJECT_INDEX.md): compact repository index for fast orientation
- [INSTALL.md](INSTALL.md): installation details and troubleshooting
- [USAGE.md](USAGE.md): usage patterns and command examples
- [COMMANDS.md](COMMANDS.md): command reference
- [ARCHITECTURE.md](ARCHITECTURE.md): project architecture

## Release Status

This repository is the source and development home for Super OpenCode.

The npm package is a bi-target OpenCode plugin package. Runtime hooks stay in the npm plugin server target, while commands, agents, skills, and instructions are materialized through the bootstrap engine into the chosen scope.

## Publishing

This package is intended to publish through GitHub Actions with npm Trusted Publishing.

Release flow:

```bash
git tag v<version>
git push origin v<version>
```

The publish workflow validates the repository, checks that the tag matches `package.json`, and publishes through npm OIDC.

## License

MIT. See [LICENSE](LICENSE).
