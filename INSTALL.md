# Installation Guide

## Supported Runtime

- Node.js 24+
- Bun 1.3.9+
- OpenCode

## Install In OpenCode

### Recommended Flow

1. Open OpenCode.
2. Press `Ctrl+P`.
3. Open `plugins`.
4. Press `Shift+I` to install from npm.
5. Enter `super-opencode-framework`.

This is the preferred path when you want to install the package from the OpenCode UX.

What happens now:

1. OpenCode installs the npm package.
2. Plugin Manager sees the package because it exposes both `./server` and `./tui`.
3. The TUI bootstrap asks you to confirm `project` or `global` scope.
4. The bootstrap syncs commands, agents, skills, instructions, `opencode.json`, and `tui.json` for that scope.
5. MCP config is merged and validated.
6. A final report explains what was installed, updated, skipped, or blocked.

## Manual Install And Bootstrap

### 1. Install The Package

With Bun:

```bash
bun add -d super-opencode-framework
```

With npm:

```bash
npm install -D super-opencode-framework
```

### 2. Sync The Bundled OpenCode Assets

With Bun:

```bash
bunx super-opencode-framework install --scope project
bunx super-opencode-framework install --scope global
```

With npm:

```bash
npx super-opencode-framework install --scope project
npx super-opencode-framework install --scope global
```

Maintenance commands:

With Bun:

```bash
bunx super-opencode-framework status --scope project
bunx super-opencode-framework update --scope project
bunx super-opencode-framework uninstall --scope project
bunx super-opencode-framework install --scope project --force
bunx super-opencode-framework install --scope global --force
```

With npm:

```bash
npx super-opencode-framework status --scope project
npx super-opencode-framework update --scope project
npx super-opencode-framework uninstall --scope project
npx super-opencode-framework install --scope project --force
npx super-opencode-framework install --scope global --force
```

### 3. Scope Behavior

Project scope writes only to the current repository:

- `.opencode/commands`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/instructions`
- `opencode.json`
- `tui.json`

Global scope writes only to the OpenCode global config directory:

- `~/.config/opencode/commands`
- `~/.config/opencode/agents`
- `~/.config/opencode/skills`
- `~/.config/opencode/instructions`
- `~/.config/opencode/opencode.json`
- `~/.config/opencode/tui.json`

The scope is always explicit. If both global and project are installed, project assets override global assets.

### 4. Configure MCPs

The bootstrap always merges framework MCP definitions into `opencode.json` and evaluates prerequisites before enabling them.

Reported states:

- `configured and enabled`
- `configured but disabled by missing env`
- `configured but disabled by missing binary`
- `configured but requires auth/manual setup`

### 5. Start OpenCode

```bash
opencode
```

## Develop This Repository

```bash
git clone https://github.com/papastanb/super-opencode.git
cd super-opencode
bun install
bun run check
bun test
bun run release:check
```

## Troubleshooting

### Node Or Bun Missing

```bash
node --version
bun --version
```

If Node.js 24+ or Bun is missing, install them first and rerun the installer.

### No `opencode.json` In The Target Project

The bootstrap creates `opencode.json` and `tui.json` when they do not already exist.

### Re-Sync The Bundled Assets

With Bun:

```bash
bunx super-opencode-framework update --scope project
bunx super-opencode-framework install --scope project --force
```

With npm:

```bash
npx super-opencode-framework update --scope project
npx super-opencode-framework install --scope project --force
```

### Validate The Package Locally

```bash
bun run release:check
```

## Trusted Publishing Setup

Super OpenCode is intended to publish through GitHub Actions using npm Trusted Publishing rather than local publish tokens.

Configure this once on npm:

1. Open the npm package settings for `super-opencode-framework`.
2. Add a Trusted Publisher.
3. Provider: GitHub Actions.
4. Organization or user: `papastanb`.
5. Repository: `super-opencode`.
6. Workflow filename: `publish.yml`.

Important constraints from npm Trusted Publishing:

- the workflow filename must match exactly: `publish.yml`
- publishing must run on GitHub-hosted runners
- npm CLI must be recent enough to support trusted publishing
- provenance is generated automatically by npm for trusted publishing from public repositories, so the workflow does not need `--provenance`

After that, publish by pushing a `v`-prefixed git tag whose numeric portion matches `package.json`.

If `package.json` contains `"version": "1.0.1"`, the release tag must be `v1.0.1`:

```bash
git tag v1.0.1
git push origin v1.0.1
```

Pushing that tag triggers the GitHub Actions publish workflow.

The workflow uses OIDC with `id-token: write`, so no npm write token should be stored in the repository.
