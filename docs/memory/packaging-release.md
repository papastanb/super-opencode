# Packaging And Release

## Package NPM

### Configuration package.json

```json
{
  "name": "super-opencode-framework",
  "version": "1.0.0",
  "main": "./dist/.opencode/plugins/super-opencode.js",
  "types": "./dist/.opencode/plugins/super-opencode.d.ts",
  "exports": {
    ".": {
      "types": "./dist/.opencode/plugins/super-opencode.d.ts",
      "import": "./dist/.opencode/plugins/super-opencode.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist/**/*",
    ".opencode/commands/**/*.md",
    ".opencode/agents/**/*.md",
    ".opencode/skills/**/SKILL.md",
    ".opencode/plugins/**/*.ts",
    ".opencode/examples/*.json",
    "docs/instructions/opencode-core.md",
    "scripts/install-project.mjs",
    "README.md",
    "INSTALL.md",
    "LICENSE"
  ],
  "dependencies": {
    "@opencode-ai/plugin": "^1.4.3"
  }
}
```

## Script d'installation

Script `scripts/install-project.mjs` qui:
- Valide la structure projet
- Vérifie la config opencode.json
- Affiche les next steps

## Documentation utilisateur

Etat actuel:
- `README.md` principal avec installation, usage et release status
- `INSTALL.md`, `USAGE.md`, `COMMANDS.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `CHANGELOG.md`
- `.opencode/README.md` retire du package publie

## Exemples de config

Fichiers d'exemple à fournir:
- Exemple opencode.json avec MCP recommandée
- Exemple de configuration commands/agents

## Validation

Checks utilises:
- `bun run check`
- `bun test`
- `bun run release:check`
- `npm publish --dry-run --loglevel=error`

## Publication

Chemin de publication vise:

1. Bump version dans `package.json`
2. Configurer npm Trusted Publishing pour le package `super-opencode-framework`
3. Configurer le workflow GitHub Actions `.github/workflows/publish.yml`
4. Tag git avec la version exacte
5. Push du tag pour declencher la publication npm via OIDC
6. Release GitHub avec changelog

Exemple:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Notes:

- le workflow verifie que le tag et `package.json` correspondent
- le workflow publie via OIDC, sans token npm stocke en repo
- `.npmrc` doit rester ignore par git et exclu du tarball npm
