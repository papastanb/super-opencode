# Memory System

## Objectif

Minimiser le cout contexte en separant :

- noyau toujours utile
- memoires secondaires specialisees
- memoire de session et checkpoints

## Fichiers principaux

- `status.md` : etat global du projet
- `implementation-plan-tracking.md` : avancement reel du plan d'implementation
- `decisions.md` : decisions durables
- `sessions/active.md` : reprise immediate

## Fichiers secondaires

- `commands-map.md`
- `agents-map.md`
- `modes-map.md`
- `mcp-strategy.md`
- `tooling-research.md`
- `plugin-engine.md`
- `persistence-design.md`
- `packaging-release.md`

## Regles

- Ne pas dupliquer l'information entre fichiers.
- Garder les fichiers principaux compacts.
- Deplacer les details techniques dans les fichiers secondaires.
- Avant compaction, suivre `sessions/README.md`.
