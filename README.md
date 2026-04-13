# Super OpenCode

> OpenCode plugin package that ports key SuperClaude workflows and includes bundled `/sc-*` assets plus local sync support.

[![CI](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml/badge.svg)](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.3.9+-fff.svg?logo=bun)](https://bun.sh)
[![Node](https://img.shields.io/badge/Node-24+-339933.svg?logo=node.js)](https://nodejs.org/)

## What It Provides

- 28 `/sc-*` commands for common engineering workflows
- 15 specialist agent prompts
- 6 reusable mode skills
- An npm-installable OpenCode plugin runtime
- Bundled command, agent, skill, plugin, and instruction assets
- Serena-first persistence guidance for OpenCode sessions

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

This installs the npm package that contains the Super OpenCode plugin runtime and its bundled assets.

## Sync Bundled Assets Locally

If you want those packaged `/sc-*` commands, agents, skills, plugins, and runtime instruction files materialized as local files in the current repository, use the manual sync command below.

## Manual Package Install And Sync

With Bun:

```bash
bun add -d super-opencode-framework
bunx super-opencode-framework install
```

With npm:

```bash
npm install -D super-opencode-framework
npx super-opencode-framework install
```

This syncs the bundled OpenCode assets into the current project:

- `.opencode/commands`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/plugins`
- `.opencode/instructions/opencode-core.md`

If `opencode.json` already exists, the sync command appends `.opencode/instructions/opencode-core.md` to the `instructions` array when needed.

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

The repo config enables `serena` and keeps the other MCPs available but disabled by default. See `.opencode/examples/opencode.example.json` for a fuller setup.

## Documentation

- [INSTALL.md](INSTALL.md): installation details and troubleshooting
- [USAGE.md](USAGE.md): usage patterns and command examples
- [COMMANDS.md](COMMANDS.md): command reference
- [ARCHITECTURE.md](ARCHITECTURE.md): project architecture

## Release Status

This repository is the source and development home for Super OpenCode.

The npm package is an OpenCode plugin package. Its `/sc-*` commands, agents, skills, plugins, and runtime instruction files are part of the package; the manual sync flow simply copies those bundled assets into the local repository when you want them as project files.

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
