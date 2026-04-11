# Installation Guide

## Prérequis

- **Bun** 1.3.9 ou supérieur
- **OpenCode** installé ou accès au CLI OpenCode

## Installation Rapide

```bash
# 1. Cloner le repository
git clone https://github.com/papastanb/super-opencode.git
cd super-opencode

# 2. Installer les dépendances
bun install

# 3. Vérifier la structure
bun run check

# 4. Lancer OpenCode
opencode
```

## Installation Détaillée

### 1. Prérequis Système

#### Windows
```powershell
# Installer Bun via PowerShell
irm https://bun.sh/install.ps1 | iex
```

#### macOS / Linux
```bash
# Installer Bun
curl -fsSL https://bun.sh/install | bash
```

### 2. Clonage du Projet

```bash
git clone https://github.com/papastanb/super-opencode.git
cd super-opencode
```

### 3. Installation des Dépendances

```bash
bun install
```

Cela installera :
- `@opencode-ai/plugin` (peer dependency)
- TypeScript 5.9+
- @types/node 24.3+

### 4. Vérification de l'Installation

```bash
# Vérifier la structure et les types
bun run check

# Lancer les tests
bun test

# Validation cross-platform
bun scripts/validate-cross-platform.mjs
```

### 5. Configuration OpenCode

Le fichier `opencode.json` est préconfiguré avec :

- **Serena MCP** (requis) - Persistance automatique
- **Context7 MCP** (recommandé) - Documentation framework
- **Sequential MCP** (recommandé) - Raisonnement complexe

Pour utiliser Serena, vérifiez qu'il est bien enabled :
```bash
opencode mcp list
```

### 6. Première Utilisation

```bash
# Démarrer OpenCode
opencode

# Utiliser /sc-help pour voir les commandes disponibles
/sc-help
```

## Configuration Avancée

### Variables d'Environnement

Pour les MCP optionnels, créez un fichier `.env` :

```bash
# Context7 (optionnel)
CONTEXT7_API_KEY=your_key_here

# Tavily (optionnel)
TAVILY_API_KEY=your_key_here

# Morph (optionnel)
MORPH_API_KEY=your_key_here
```

### Personnalisation MCP

Éditez `opencode.json` pour activer/désactiver les MCP :

```json
{
  "mcp": {
    "serena": { "enabled": true },
    "context7": { "enabled": true },
    "sequential": { "enabled": true },
    "playwright": { "enabled": false },
    "tavily": { "enabled": false },
    "morph": { "enabled": false }
  }
}
```

## Dépannage

### Bun non installé
```bash
# Vérifier l'installation de Bun
bun --version

# Si pas installé, suivre les instructions sur https://bun.sh
```

### Erreur de permissions
```bash
# Sous Windows, exécuter en tant qu'administrateur
# Sous Linux/macOS, vérifier les permissions du dossier
chmod -R 755 .
```

### MCP non détecté
```bash
# Vérifier la configuration MCP
opencode mcp list

# Si absent, vérifier opencode.json
cat opencode.json | jq '.mcp'
```

### Tests échoués
```bash
# Reinstaller les dépendances
rm -rf node_modules bun.lock
bun install

# Relancer les tests
bun test
```

## Désinstallation

```bash
# Supprimer le dossier du projet
cd ..
rm -rf super-opencode

# Optionnel: supprimer les caches OpenCode
rm -rf ~/.opencode/cache
```

## Prochaines Étapes

- Voir [USAGE.md](USAGE.md) pour l'utilisation
- Voir [COMMANDS.md](COMMANDS.md) pour la référence des commandes
- Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour les détails techniques