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
4. Install `super-opencode-framework`.

This is the preferred path when you want to install the framework as an OpenCode plugin/package from the editor UX.

## Manual Install In An Existing Project

### 1. Install The Package

With Bun:

```bash
bun add -d super-opencode-framework
```

With npm:

```bash
npm install -D super-opencode-framework
```

### 2. Scaffold The OpenCode Assets

With Bun:

```bash
bunx super-opencode-framework install
```

With npm:

```bash
npx super-opencode-framework install
```

Optional flags:

With Bun:

```bash
bunx super-opencode-framework install --target /path/to/project
bunx super-opencode-framework install --force
```

With npm:

```bash
npx super-opencode-framework install --target /path/to/project
npx super-opencode-framework install --force
```

### 3. Verify Your Project Config

The installer copies the Super OpenCode runtime assets into your project and updates `opencode.json` when it already exists.

Review these locations after installation:

- `.opencode/commands`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/plugins`
- `.opencode/instructions/opencode-core.md`

### 4. Configure MCPs

Super OpenCode expects Serena for the full persistence workflow.

Recommended MCP strategy:

- `serena`: enabled
- `context7`: optional, recommended
- `sequential`: optional, recommended
- `playwright`, `chrome-devtools`, `tavily`, `morph`: optional

Check the example config in `.opencode/examples/opencode.example.json`.

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

The installer can scaffold Super OpenCode without `opencode.json`, but it cannot update instructions automatically.

Add this path manually to your OpenCode config:

```json
{
    "instructions": [".opencode/instructions/opencode-core.md"]
}
```

### Reinstall The Scaffold

With Bun:

```bash
bunx super-opencode-framework install --force
```

With npm:

```bash
npx super-opencode-framework install --force
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
