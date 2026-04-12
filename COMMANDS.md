# Référence des Commandes

## Index des Commandes

| Commande | Description | Agent |
|----------|-------------|-------|
| [Workflow](#workflow) | | |
| `/sc-brainstorm` | Brainstorming collaboratif | build |
| `/sc-design` | Conception logicielle | build |
| `/sc-implement` | Implémentation de code | build |
| [Diagnostic](#diagnostic) | | |
| `/sc-analyze` | Analyse de code | build |
| `/sc-troubleshoot` | Dépannage | root-cause-analyst |
| [Qualité](#qualité) | | |
| `/sc-test` | Tests et validation | quality-engineer |
| `/sc-document` | Documentation | technical-writer |
| `/sc-improve` | Amélioration de code | refactoring-expert |
| `/sc-cleanup` | Nettoyage de code | refactoring-expert |
| [Recherche](#recherche) | | |
| `/sc-research` | Recherche approfondie | deep-research-agent |
| `/sc-explain` | Explication de code | learning-guide |
| `/sc-estimate` | Estimation de tâches | build |
| [Orchestration](#orchestration) | | |
| `/sc-task` | Gestion de tâches | pm-agent |
| `/sc-workflow` | Orchestration de workflows | pm-agent |
| `/sc-agent` | Sélection d'agent | build |
| `/sc-spawn` | Orchestration méta-système | build |
| [Gestion de Projet](#gestion-de-projet) | | |
| `/sc-pm` | Gestion de projet | pm-agent |
| `/sc-recommend` | Recommandations | build |
| `/sc-business-panel` | Panel d'experts | build |
| [Persistance](#persistance) | | |
| `/sc-save` | Sauvegarder session | pm-agent |
| `/sc-load` | Charger session | pm-agent |
| `/sc-reflect` | Réflexion | pm-agent |
| [Index](#index) | | |
| `/sc-index` | Indexer projet | build |
| `/sc-index-repo` | Indexer repository | build |
| [Outils](#outils) | | |
| `/sc-build` | Build de projet | build |
| `/sc-git` | Opérations Git | build |
| `/sc-select-tool` | Sélection d'outil MCP | build |
| [Système](#système) | | |
| `/sc-help` | Aide et documentation | build |

---

## Détails des Commandes

### Workflow

#### `/sc-brainstorm`
- **Description** : Brainstorming collaboratif pour explorer des idées
- **Agent** : build
- **Skill** : sc-brainstorming
- **Usage** : `/sc-brainstorm nouvelle fonctionnalité cool`

#### `/sc-design`
- **Description** : Conception logicielle structurée
- **Agent** : build
- **Usage** : `/sc-design système d'authentification`

#### `/sc-implement`
- **Description** : Implémentation de code
- **Agent** : build
- **Skill** : sc-orchestration
- **Usage** : `/sc-implement fonction login`

---

### Diagnostic

#### `/sc-analyze`
- **Description** : Analyse approfondie de code
- **Agent** : build
- **Skill** : sc-introspection
- **Usage** : `/sc-analyze code complexe du module auth`

#### `/sc-troubleshoot`
- **Description** : Dépannage et résolution de problèmes
- **Agent** : root-cause-analyst
- **Skill** : sc-introspection
- **Usage** : `/sc-troubleshoot l'erreur dans auth.ts`

---

### Qualité

#### `/sc-test`
- **Description** : Génération et exécution de tests
- **Agent** : quality-engineer
- **Usage** : `/sc-test composant Button`

#### `/sc-document`
- **Description** : Création de documentation
- **Agent** : technical-writer
- **Usage** : `/sc-document API REST`

#### `/sc-improve`
- **Description** : Amélioration systématique du code
- **Agent** : refactoring-expert
- **Auto-fix** : Style, imports, variables inutilisées
- **Approval** : Changements architecturaux, refactoring logique
- **Usage** : `/sc-improve performance du module orders`

#### `/sc-cleanup`
- **Description** : Nettoyage (dead code, imports inutiles)
- **Agent** : refactoring-expert
- **Auto-fix** : Imports inutiles, dead code sans références
- **Approval** : Code avec références indirectes, API publique
- **Usage** : `/sc-cleanup fichiers obsolètes`

---

### Recherche

#### `/sc-research`
- **Description** : Recherche approfondie
- **Agent** : deep-research-agent
- **Skill** : sc-deep-research
- **Usage** : `/sc-research最佳实践 React 2026`

#### `/sc-explain`
- **Description** : Explication de code ou concepts
- **Agent** : learning-guide
- **Usage** : `/sc-explain comment fonctionne useEffect`

#### `/sc-estimate`
- **Description** : Estimation de temps de développement
- **Agent** : build
- **Skill** : sc-orchestration
- **Usage** : `/sc-estimate refonte仪表板`

---

### Orchestration

#### `/sc-task`
- **Description** : Gestion de tâches structurée
- **Agent** : pm-agent
- **Skill** : sc-task-management
- **Usage** : `/sc-task implémenter feature`

#### `/sc-workflow`
- **Description** : Orchestration de workflows complexes
- **Agent** : pm-agent
- **Skill** : sc-orchestration
- **Usage** : `/sc-workflow déploiement production`

#### `/sc-agent`
- **Description** : Sélection et invocation d'agent
- **Agent** : build
- **Usage** : `/sc-agent system-architect`

#### `/sc-spawn`
- **Description** : Décomposition de tâche complexe en sous-tâches
- **Agent** : build
- **Skill** : sc-orchestration
- **Output** : Hiérarchie Epic → Story → Task → Subtask
- **Usage** : `/sc-spawn migrer vers TypeScript`

---

### Gestion de Projet

#### `/sc-pm`
- **Description** : Gestion de projet et contexte de session
- **Agent** : pm-agent
- **MCP** : Serena (requis)
- **Usage** : `/sc-pm afficher le contexte`

#### `/sc-recommend`
- **Description** : Recommander la meilleure commande pour une tâche
- **Agent** : build
- **Usage** : `/sc-recommend je veux faire un chatbot`

#### `/sc-business-panel`
- **Description** : Panel d'experts business (Porter, Drucker, etc.)
- **Agent** : build
- **Options** : --experts, --mode (discussion/debate/socratic/adaptive)
- **Usage** : `/sc-business-panel stratégie expansion`

---

### Persistance

#### `/sc-save`
- **Description** : Sauvegarder l'état actuel de la session
- **Agent** : pm-agent
- **MCP** : Serena (requis)
- **Usage** : `/sc-save checkpoint avant refactor`

#### `/sc-load`
- **Description** : Charger une session sauvegardée
- **Agent** : pm-agent
- **MCP** : Serena (requis)
- **Usage** : `/sc-load restaurer dernier checkpoint`

#### `/sc-reflect`
- **Description** : Réflexion structurée sur le travail en cours
- **Agent** : pm-agent
- **Skill** : sc-introspection
- **Usage** : `/sc-reflect évaluer avancement sprint`

---

### Index

#### `/sc-index`
- **Description** : Indexer le projet actuel
- **Agent** : build
- **Output** : PROJECT_INDEX.md, PROJECT_INDEX.json
- **Usage** : `/sc-index mettre à jour l'index`

#### `/sc-index-repo`
- **Description** : Indexer la structure du repository
- **Agent** : build
- **Usage** : `/sc-index-repo analyser structure`

---

### Outils

#### `/sc-build`
- **Description** : Build et compilation du projet
- **Agent** : build
- **Skill** : sc-orchestration
- **Usage** : `/sc-build compiler pour production`

#### `/sc-git`
- **Description** : Opérations Git intelligentes
- **Agent** : build
- **Skill** : sc-orchestration
- **Usage** : `/sc-git commit avec conventional format`

#### `/sc-select-tool`
- **Description** : Sélection automatique du meilleur outil MCP
- **Agent** : build
- **Skill** : sc-orchestration
- **Output** : Recommandation Serena vs Morph
- **Usage** : `/sc-select-tool opération complexe`

---

### Système

#### `/sc-help`
- **Description** : Afficher l'aide et la documentation
- **Agent** : build
- **Usage** : `/sc-help`, `/sc-help sc-implement`