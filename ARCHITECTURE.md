# Architecture

## Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                     Super OpenCode                          │
├─────────────────────────────────────────────────────────────┤
│  User → Commands (/sc-*) → Agents → Skills → MCP/Plugins  │
└─────────────────────────────────────────────────────────────┘
```

## Couches Techniques

### 1. Instruction Layer

Contient les règles, conventions et documentation de comportement.

- `AGENTS.md` - Instructions globales
- `docs/instructions/opencode-core.md` - Instructions spécifiques OpenCode

### 2. Command Layer (`/sc-*`)

Expose les workflows utilisateur via des commandes OpenCode.

| Catégorie | Commandes |
|----------|-----------|
| Workflow | `/sc-brainstorm`, `/sc-design`, `/sc-implement` |
| Diagnostic | `/sc-analyze`, `/sc-troubleshoot` |
| Qualité | `/sc-test`, `/sc-document`, `/sc-improve`, `/sc-cleanup` |
| Recherche | `/sc-research`, `/sc-explain`, `/sc-estimate` |
| Orchestration | `/sc-task`, `/sc-workflow`, `/sc-agent`, `/sc-spawn` |
| PM | `/sc-pm`, `/sc-recommend`, `/sc-business-panel` |
| Persistance | `/sc-save`, `/sc-load`, `/sc-reflect` |
| Index | `/sc-index`, `/sc-index-repo` |
| Outils | `/sc-build`, `/sc-git`, `/sc-select-tool` |

Cette couche vit dans `.opencode/commands/`.

### 3. Agent Layer

Agents spécialisés inspirés de SuperClaude.

| Agent | Domaine |
|-------|---------|
| pm-agent | Gestion de projet et orchestration |
| system-architect | Architecture système |
| backend-architect | Architecture backend |
| frontend-architect | Architecture frontend |
| devops-architect | Infrastructure et DevOps |
| security-engineer | Sécurité |
| performance-engineer | Performance |
| root-cause-analyst | Analyse de problèmes |
| quality-engineer | Qualité et tests |
| refactoring-expert | Refactoring |
| python-expert | Python |
| requirements-analyst | Analyse des besoins |
| technical-writer | Documentation |
| learning-guide | Apprentissage |
| deep-research-agent | Recherche |

Cette couche vit dans `.opencode/agents/`.

### 4. Skill Layer

Skills chargeables pour les comportements mode.

| Skill | Usage |
|-------|-------|
| sc-brainstorming | Brainstorming collaboratif |
| sc-introspection | Réflexion et analyse |
| sc-deep-research | Recherche structurée |
| sc-task-management | Gestion de tâches |
| sc-orchestration | Orchestration |
| sc-token-efficiency | Efficacité tokens |

Cette couche vit dans `.opencode/skills/`.

### 5. MCP Integration Layer

Configuration des MCP dans `opencode.json`.

| MCP | Status | Usage |
|-----|--------|-------|
| serena | ✅ Requis | Persistance et mémoire |
| context7 | ✅ Recommandé | Documentation |
| sequential | ✅ Recommandé | Raisonnement |
| playwright | ⚪ Optionnel | Tests navigateur |
| tavily | ⚪ Optionnel | Recherche web |
| morph | ⚪ Optionnel | Édition rapide |

### 6. Plugin Layer

Plugin principal dans `.opencode/plugins/super-opencode/`.

**Modules :**
- `system.ts` - Hooks système (persistence contract)
- `commands.ts` - Hooks de commandes (hints)
- `compaction.ts` - Hooks de compaction (checkpoint)
- `memory.ts` - Utilitaires et contrats

### 7. Custom Tools Layer

Outils spécifiques dans `.opencode/tools/`.

## Flux d'Exécution

```
1. opencode → charge opencode.json, AGENTS.md, .opencode/*
2. /sc-* command → sélectionne agent + skill
3. Agent exécuté → utilise MCP si besoin
4. Plugin capturen → événements pour persistance
5. Résultat → retourne à l'utilisateur
```

## Technologies

| Composant | Technologie |
|-----------|-------------|
| Runtime | Bun 1.3.9+ |
| Langage | TypeScript 5.9+ |
| Plugin SDK | @opencode-ai/plugin 1.4.0+ |
| Tests | Bun test |
| CI/CD | GitHub Actions |

## Structure des Fichiers

```
super-opencode/
├── .opencode/
│   ├── commands/      # 28 commandes /sc-*
│   ├── agents/        # 15 agents
│   ├── skills/        # 6 skills
│   ├── plugins/       # Plugin principal
│   └── tools/         # Outils custom
├── docs/
│   ├── memory/       # Mémoire projet
│   └── instructions/  # Instructions
├── scripts/           # Scripts utilitaires
├── tests/             # Tests
├── opencode.json      # Configuration
└── package.json       # Package npm
```

## Conventions

- **Commandes** : `/sc-*` (slash + sc + nom)
- **Agents** : kebab-case (pm-agent, system-architect)
- **Skills** : snake_case (sc_brainstorming)
- **Persistance** : Serena MCP comme source de vérité

## Patterns

### Command → Agent → Skill → MCP

```bash
/sc-implement "feature X"
  → agent: build
  → skill: sc-orchestration
  → MCP: serena (persistence), context7 (docs)
```

### Persistance

```bash
/sc-save → write_memory("pm_context", state)
/sc-load → read_memory("pm_context") → restore
/sc-reflect → read_memory("current_plan") → analyze
```

## Décisions Structurantes

- Runtime: Bun + TypeScript
- Package: npm (prêt pour publication)
- Plateforme: Windows, macOS, Linux
- Commandes: `/sc-*`
- Fidélité: Compatibilité fonctionnelle forte
- Persistance: Avancée (Serena) dès V1
