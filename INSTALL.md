# Installation Guide

## Supported Runtime

- Node.js 24+
- Bun 1.3.9+
- OpenCode

## Install In An Existing Project

### 1. Install The Package

```bash
bun add -d super-opencode
```

### 2. Scaffold The OpenCode Assets

```bash
bunx super-opencode install
```

Optional flags:

```bash
bunx super-opencode install --target /path/to/project
bunx super-opencode install --force
```

### 3. Verify Your Project Config

The installer copies the Super OpenCode runtime assets into your project and updates `opencode.json` when it already exists.

Review these locations after installation:

- `.opencode/commands`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/plugins`
- `docs/instructions/opencode-core.md`

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

## Secret Handling

Do not store personal API keys in repository files or in shared examples.

If you enable optional MCPs that require credentials, prefer environment variables or your OS secret store over plaintext values in user config files.

Recommended pattern:

```bash
export MORPH_API_KEY=your_key_here
```

Then reference the environment-backed secret from your local OpenCode setup instead of committing or sharing a plaintext key.

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
  "instructions": ["docs/instructions/opencode-core.md"]
}
```

### Reinstall The Scaffold

```bash
bunx super-opencode install --force
```

### Validate The Package Locally

```bash
bun run release:check
```
