# Super OpenCode

> Portage complet de SuperClaude vers OpenCode - Framework de productivité développeur

[![CI](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml/badge.svg)](https://github.com/papastanb/super-opencode/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.3.9+-fff.svg?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178c6.svg?logo=typescript)](https://www.typescriptlang.org/)

## Description

Super OpenCode est un framework de productivité développeur qui apporte les fonctionnalités de SuperClaude à OpenCode. Il offre un ensemble de commandes, agents, et skills optimisés pour le développement moderne.

## Fonctionnalités

- **28 commandes** `/sc-*` pour toutes les tâches de développement
- **15 agents spécialisés** (PM, Architecture, Security, etc.)
- **6 skills de modes** (Brainstorming, Introspection, Deep Research, etc.)
- **Persistance avancées** avec Serena MCP
- **Plugin OpenCode** avec hooks pour l'orchestration
- **Suite de tests** automatisée

## Démarrage Rapide

```bash
# Cloner le projet
git clone https://github.com/papastanb/super-opencode.git
cd super-opencode

# Installer les dépendances
bun install

# Vérifier la structure
bun run check

# Lancer OpenCode
opencode
```

Voir [INSTALL.md](INSTALL.md) pour des instructions d'installation détaillées.

## Documentation

| Document | Description |
|----------|-------------|
| [INSTALL.md](INSTALL.md) | Guide d'installation |
| [USAGE.md](USAGE.md) | Guide d'utilisation |
| [COMMANDS.md](COMMANDS.md) | Référence des commandes |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture technique |

## Commandes Disponibles

- `/sc-brainstorm` - Brainstorming collaboratif
- `/sc-design` - Conception logicielle
- `/sc-implement` - Implémentation de code
- `/sc-analyze` - Analyse de code
- `/sc-troubleshoot` - Dépannage
- `/sc-test` - Tests et validation
- `/sc-document` - Documentation
- `/sc-research` - Recherche
- `/sc-task` - Gestion de tâches
- `/sc-workflow` - Orchestration de workflows
- `/sc-agent` - Sélection d'agent
- `/sc-pm` - Gestion de projet
- `/sc-help` - Aide et documentation
- `/sc-recommend` - Recommandations
- `/sc-index` - Indexation de projet
- `/sc-index-repo` - Indexation de repository
- `/sc-save` - Sauvegarde de session
- `/sc-load` - Chargement de session
- `/sc-reflect` - Réflexion sur le travail
- `/sc-estimate` - Estimation de tâches
- `/sc-build` - Build de projet
- `/sc-improve` - Amélioration de code
- `/sc-cleanup` - Nettoyage de code
- `/sc-explain` - Explication de code
- `/sc-git` - Opérations Git
- `/sc-select-tool` - Sélection d'outil MCP
- `/sc-spawn` - Orchestration méta-système
- `/sc-business-panel` - Panel d'experts business

Voir [COMMANDS.md](COMMANDS.md) pour la référence complète.

## MCP Supportés

| MCP | Status | Description |
|-----|--------|-------------|
| **serena** | ✅ Requis | Persistance et mémoire |
| **context7** | ✅ Recommandé | Documentation framework |
| **sequential** | ✅ Recommandé | Raisonnement complexe |
| **playwright** | ⚪ Optionnel | Tests navigateur |
| **tavily** | ⚪ Optionnel | Recherche web |
| **morph** | ⚪ Optionnel | Édition rapide |

## Technologies

- **Runtime**: Bun 1.3.9+
- **Language**: TypeScript 5.9+
- **Plugin SDK**: @opencode-ai/plugin 1.4.0+
- **Tests**: Bun test

## Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT License - voir [LICENSE](LICENSE)

## Liens Utiles

- [Documentation OpenCode](https://docs.opencode.ai)
- [SuperClaude Original](https://github.com/superclaude/superclaude)
- [Serena MCP](https://github.com/oraios/serena)