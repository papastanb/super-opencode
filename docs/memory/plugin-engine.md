# Plugin Engine

## Architecture

Le plugin principal Super OpenCode est implémenté dans `.opencode/plugins/super-opencode.ts` et utilise le SDK `@opencode-ai/plugin` v1.4.3.

### Structure des fichiers

```
.opencode/plugins/super-opencode/
├── super-opencode.ts       # Point d'entrée du plugin
├── system.ts               # Hooks système (system transform)
├── commands.ts             # Hooks de commandes (before execution)
├── compaction.ts           # Hooks de compaction session
└── memory.ts               # Utilitaires et contrats de persistance
```

## Hooks implémentés

### System Hooks

- `experimental.chat.system.transform`: Injecte le contrat de persistance Serena dans le contexte système

### Command Hooks

- `command.execute.before`: Ajoute des hints pour les commandes de persistance et checkpoint
  - Persistence commands: sc-pm, sc-save, sc-load, sc-reflect
  - Checkpoint commands: sc-save, sc-spawn, sc-workflow

### Compaction Hooks

- `experimental.session.compacting`: Injecte le contexte mémoire avant compaction
  - Affiche le status projet
  - Affiche la session active
  - Affiche le tracking d'implémentation
  - Inclut les hints de checkpoint automatique
  - Inclut le contrat de persistance Serena complet

## Persistance Avancée

### Contrat Serena

- Source de vérité: Serena memory
- Clés principales: pm_context, current_plan, last_session, next_actions, checkpoint, decision, summary
- Projection: docs/memory/ comme fallback humain

### Hiérarchie de tâches (depuis Phase 2)

- plan_[timestamp]: Goal statement
- phase_[1-5]: Milestone descriptions
- task_[phase].[number]: Deliverable status
- todo_[task].[number]: Atomic action completion
- checkpoint_[timestamp]: State snapshot

## Checkpoint automatique

- Template: checkpointTemplate dans memory.ts
- Hint: autoCheckpointHint pour sessions longues
- Integration: Via hooks de compaction
