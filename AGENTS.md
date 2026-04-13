# Super OpenCode

## Mission

Porter SuperClaude vers OpenCode sous forme d'un plugin npm pour OpenCode, avec assets bundles optionnels pour sync locale et publication publique.

## Regles de contexte

- Garder les fichiers principaux tres courts.
- Ne charger un fichier secondaire que si la tache l'exige.
- Utiliser Serena comme source de verite pour la continuite de session quand elle est disponible.
- Utiliser le plus petit ensemble pertinent de skills, sous-agents, MCPs et options/flags qui ameliore materiellement la qualite d'execution.
- Charger d'abord les skills de processus, puis les skills metier ou d'implementation.
- Utiliser les MCPs quand ils apportent un gain reel de validation, documentation officielle, exploration, raisonnement, persistance ou confiance de release.
- Si un skill ou MCP prefere est indisponible, expliciter la degradation et utiliser la meilleure alternative.
- Ne pas committer de notes de session, checkpoints locaux, secrets, ou artefacts de review temporaires.

## Ordre de lecture par defaut

1. `AGENTS.md`
2. `README.md`
3. `ARCHITECTURE.md`

Lire ensuite seulement si necessaire :

- `INSTALL.md` pour l'installation et la publication
- `COMMANDS.md` pour les commandes
- `USAGE.md` pour les usages
- `.opencode/instructions/opencode-core.md` pour la couche comportementale runtime
