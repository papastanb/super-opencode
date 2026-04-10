# Super OpenCode

## Mission

Porter SuperClaude vers OpenCode sous forme d'un framework installable, cross-platform, structure pour une future publication publique.

## Regles de contexte

- Garder les fichiers principaux tres courts.
- Mettre les details dans `docs/memory/`.
- Ne charger un fichier secondaire que si la tache l'exige.
- Mettre a jour la memoire au fil de l'eau, pas en fin de sprint.
- Avant toute compaction, appliquer le protocole de checkpoint de `docs/memory/sessions/README.md`.

## Ordre de lecture par defaut

1. `AGENTS.md`
2. `docs/memory/status.md`
3. `docs/memory/sessions/active.md`

Lire ensuite seulement si necessaire :

- `ARCHITECTURE.md` pour structure et responsabilites
- `docs/PORTING_PLAN.md` pour le plan de reference
- `docs/memory/implementation-plan-tracking.md` pour l'avancement reel du plan
- `docs/memory/decisions.md` pour les decisions durables
- `docs/memory/commands-map.md` pour les commandes
- `docs/memory/agents-map.md` pour les agents
- `docs/memory/modes-map.md` pour les modes
- `docs/memory/mcp-strategy.md` pour les MCP
- `docs/memory/tooling-research.md` pour skills, plugins et LSP utiles au projet
- `docs/memory/plugin-engine.md` pour les plugins et hooks
- `docs/memory/persistence-design.md` pour save/load et checkpoints
- `docs/memory/packaging-release.md` pour packaging et publication

## Mise a jour memoire

- `status.md` : etat global du projet
- `implementation-plan-tracking.md` : suivi reel des phases 0 a 5
- `decisions.md` : decisions durables
- `sessions/active.md` : reprise immediate de session
- `sessions/archive/` : checkpoints horodates avant compaction ou jalon important
