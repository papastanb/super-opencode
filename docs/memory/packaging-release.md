# Packaging And Release

## Package NPM

### Configuration package.json

```json
{
  "name": "super-opencode",
  "version": "1.0.0",
  "main": ".opencode/plugins/super-opencode.ts",
  "exports": {
    ".": ".opencode/plugins/super-opencode.ts",
    "./commands": ".opencode/commands/",
    "./agents": ".opencode/agents/",
    "./skills": ".opencode/skills/"
  },
  "files": [".opencode/**/*", "docs/**/*.md"],
  "peerDependencies": {
    "@opencode-ai/plugin": "^1.4.0"
  }
}
```

## Script d'installation

Script `scripts/install-project.mjs` qui:
- Valide la structure projet
- Vérifie la config opencode.json
- Affiche les next steps

## Documentation utilisateur

À créer:
- README.md principal avec Installation, Usage, Commands
- .opencode/README.md pour la config locale

## Exemples de config

Fichiers d'exemple à fournir:
- Exemple opencode.json avec MCP recommandée
- Exemple de configuration commands/agents

## Vérification Cross-Platform

Scripts vérifiant:
- Windows (PowerShell)
- macOS (zsh/bash)
- Linux (bash)

## Publication

Steps:
1. Bump version dans package.json
2. npm publish --access public
3. Tag git avec version
4. Release GitHub avec changelog
