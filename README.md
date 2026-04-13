# Super OpenCode

> Installable OpenCode framework that ports key SuperClaude workflows into a reusable project scaffold.

[![CI](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml/badge.svg)](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.3.9+-fff.svg?logo=bun)](https://bun.sh)
[![Node](https://img.shields.io/badge/Node-24+-339933.svg?logo=node.js)](https://nodejs.org/)

## What It Provides

- 28 `/sc-*` commands for common engineering workflows
- 15 specialist agent prompts
- 6 reusable mode skills
- A local OpenCode plugin layer for persistence and compaction hints
- Serena-first persistence guidance with repo-friendly scaffolding

## Runtime Contract

- Node.js 24+
- Bun 1.3.9+
- OpenCode

## Install In An Existing OpenCode Project

```bash
bun add -d super-opencode-framework
bunx super-opencode-framework install
```

This installs the Super OpenCode scaffold into the current project:

- `.opencode/commands`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/plugins`
- `docs/instructions/opencode-core.md`

If `opencode.json` already exists, the installer appends `docs/instructions/opencode-core.md` to the `instructions` array when needed.

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

The npm package is intended to scaffold Super OpenCode into existing OpenCode projects. Internal planning files under `docs/memory/` are not part of the published package contract.

## Publishing

This package is intended to publish through GitHub Actions with npm Trusted Publishing.

Release flow:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The publish workflow validates the repository, checks that the tag matches `package.json`, and publishes through npm OIDC.

## License

MIT. See [LICENSE](LICENSE).
