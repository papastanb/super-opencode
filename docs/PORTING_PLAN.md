# Porting Plan

## Vision

Construire un framework OpenCode installable qui reconstitue l'essentiel de SuperClaude en utilisant :

- `opencode.json`
- `.opencode/commands/`
- `.opencode/agents/`
- `.opencode/skills/`
- `.opencode/plugins/`
- `.opencode/tools/`

## Cibles fonctionnelles

### 1. Commandes

Porter l'ensemble des commandes majeures sous forme ` /sc-* ` en se realignant sur le set upstream SuperClaude et en priorisant une V1 pragmatique pour OpenCode.

Priorite Phase 1 :

- `sc-brainstorm`
- `sc-design`
- `sc-implement`
- `sc-analyze`
- `sc-troubleshoot`
- `sc-test`
- `sc-document`
- `sc-research`
- `sc-task`
- `sc-workflow`
- `sc-agent`
- `sc-pm`
- `sc-help`
- `sc-recommend`
- `sc-index-repo`
- `sc-index`
- `sc-save`
- `sc-load`
- `sc-reflect`

Backlog de realignement upstream a planifier ensuite :

- `sc-estimate`
- `sc-build`
- `sc-improve`
- `sc-cleanup`
- `sc-explain`
- `sc-reflect`
- `sc-git`
- `sc-select-tool`
- `sc-spawn`
- `sc-business-panel`

### 2. Agents

Porter les agents a plus forte valeur, avec realignement explicite sur les agents upstream quand ils apportent une structure cle au framework :

- `system-architect`
- `backend-architect`
- `frontend-architect`
- `devops-architect`
- `security-engineer`
- `performance-engineer`
- `root-cause-analyst`
- `quality-engineer`
- `refactoring-expert`
- `python-expert`
- `requirements-analyst`
- `technical-writer`
- `learning-guide`
- `deep-research-agent`
- `pm-agent`

### 3. Modes

Reconstituer les modes SuperClaude en combinant :

- commandes specialisees
- prompts d'agents
- skills
- hooks plugin

Modes a couvrir :

- brainstorming
- introspection
- deep research
- task management
- orchestration
- token efficiency

### 4. MCP

Proposer une config de reference OpenCode pour les MCP compatibles et des degradations propres quand un MCP manque.

### 5. Persistance

Implementer une persistance avancee V1 pour :

- sauvegarde de contexte de travail
- restauration de session
- checkpoints de plan
- etat des workflows multi-etapes
- traces de decisions importantes

## Compatibilite par feature

### Nativement portables

- regles globales et instructions
- skills
- agents
- MCP
- custom commands
- plugins
- custom tools

### Portables avec adaptation moderee

- orchestration multi-agents
- workflows de recherche
- indexation de repo
- modes comportementaux
- alias de compatibilite

### Portables seulement via plugin ou reimplementation

- save/load type SuperClaude
- auto-documentation PM agent
- auto-routage fin des modes
- compatibilite UX proche de Claude Code

## Angles morts identifies et decisions de traitement

### 1. Namespace de commandes

Decision : utiliser ` /sc-* ` comme convention OpenCode native.

### 2. Compatibilite des flags SuperClaude

Decision : ne pas reproduire tous les flags comme flags CLI opaques.
Solution :

- convertir les usages frequents en commandes dediees
- utiliser les arguments de commande OpenCode pour les variantes utiles
- releguer les comportements transverses aux agents et skills

### 3. Modes comportementaux

Decision : les traiter comme une capacite composee, pas comme une primitive unique.
Solution :

- prompt d'agent + commande + skill + event hooks

### 4. Save/load persistant

Decision : plugin dedie V1.
Solution :

- stockage structure des checkpoints et resumés
- API locale de lecture/ecriture de session
- commandes ` /sc-save ` et ` /sc-load ` sur ces primitives

### 5. Indexation de repo

Decision : ne pas compter sur un systeme opaque unique.
Solution :

- combiner LSP, agents `explore`, custom tool d'index, caches locaux

### 6. Publication future

Decision : structure npm/plugin des V1.
Solution :

- separer nettement contenus de config et logique plugin
- prevoir un package installable et une config exemple

### 7. Cross-platform

Decision : aucune hypothese shell Unix seule.
Solution :

- scripts Node/Bun uniquement pour la logique critique
- eviter les workflows shell non portables dans les fonctions centrales

### 8. Dependances MCP optionnelles

Decision : experience degradee propre.
Solution :

- classer les MCP en requis, recommandes, optionnels
- documenter les fallback comportementaux

### 9. Tests du framework

Decision : inclure une strategie de test des V1.
Solution :

- tests de structure de config
- tests de generation/chargement des commandes et agents
- tests plugin sur hooks critiques
- tests d'installation locale

### 10. Separation contenu vs moteur

Decision : deux sous-systemes explicites.
Solution :

- couche contenu : prompts, commandes, agents, skills
- couche moteur : plugin, tools, persistance, orchestration

## Plan de mise en oeuvre

### Phase -1. Tooling Research And Setup

- rechercher les skills externes utiles au developpement du portage
- rechercher les plugins OpenCode utiles a la construction du framework sans court-circuiter les features que nous voulons developper nous-memes
- identifier les LSP necessaires au repo et a la productivite du projet
- installer uniquement l'outillage de construction justifie et non concurrent avec les objectifs du portage

### Phase 0. Foundation

- initialiser le package TypeScript/Bun
- definir l'arborescence du framework
- poser `opencode.json` de reference
- ajouter docs, conventions et tests de base

### Phase 1. Core Compatibility

- porter les instructions globales dans un fichier projet dedie OpenCode
- creer les commandes ` /sc-* ` prioritaires en se basant sur les fichiers upstream `src/superclaude/commands/*.md`
- etendre le lot commandes avec `sc-pm`, `sc-help`, `sc-recommend`, `sc-index`, `sc-index-repo`
- integrer la persistance Serena comme source de verite avec `sc-save`, `sc-load` et `sc-reflect`
- creer les agents coeur en se basant sur `src/superclaude/agents/*.md`, y compris `pm-agent`
- ajouter un support minimal des modes upstream via `.opencode/skills/`
- brancher la config MCP de reference avec fallback documente

### Phase 2. Behavioral Reconstruction

- recreer les modes brainstorming, introspection, task management, orchestration, token efficiency
- encapsuler les comportements via prompts, skills et commandes

### Phase 3. Plugin Engine

- implementer le plugin OpenCode principal
- ajouter les hooks d'orchestration
- ajouter la persistance avancee
- implementer la documentation et les checkpoints automatiques

### Phase 4. Advanced Features

- `sc-spawn`
- moteur de recommandations et de selection de workflows avance

### Phase 5. Packaging and Publishing Readiness

- package npm installable
- script d'installation projet
- documentation utilisateur
- exemples de config
- verification cross-platform

## Questions deja tranchees

- repo prive au depart : oui
- structure publiable : oui
- installation automatisee V1 : oui
- commandes OpenCode : ` /sc-* `
- support cross-platform V1 : oui
- persistance avancee V1 : oui
- plugin OpenCode reutilisable : oui
- fidelite visee : compatibilite fonctionnelle forte

## Questions non bloquantes restantes

- choix exact du format de persistance interne
- niveau d'emulation de certaines commandes secondaires SuperClaude
- liste finale des MCP declares requis vs optionnels
- politique de versioning du package public futur
- choix final des plugins OpenCode tiers a garder en environnement de developpement sans introduire de conflit avec le moteur interne du projet

Ces points peuvent etre resolus pendant la Phase 0 sans remettre en cause l'architecture generale.

## Definition of Ready pour commencer le code

- architecture cible validee
- convention de commandes validee
- couches plugin/skills/agents/commands separees
- decisions de distribution et de portabilite tranchees
- liste des ecarts a OpenCode recensee
- fallback MCP defini par categorie

Le projet est pret a entrer en implementation.
