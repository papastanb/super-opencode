# Architecture

## But

Ce projet porte les capacites de SuperClaude vers OpenCode sans chercher un clone technique de Claude Code.

Le principe retenu est :

- reproduire la valeur fonctionnelle de SuperClaude
- utiliser les primitives natives d'OpenCode quand elles existent
- completer les manques avec des plugins, custom tools et conventions locales

## Couches techniques

### 1. Instruction Layer

Contient les regles, conventions et documentation de comportement.

- `AGENTS.md`
- `CLAUDE.md` si necessaire pour compatibilite
- fichiers de directives partages dans `docs/` ou `instructions/`

### 2. Command Layer

Expose les workflows utilisateur via des commandes OpenCode ` /sc-* `.

Exemples :

- `/sc-brainstorm`
- `/sc-implement`
- `/sc-analyze`
- `/sc-troubleshoot`
- `/sc-research`
- `/sc-task`

Cette couche vit principalement dans `.opencode/commands/`.

### 3. Agent Layer

Recree les specialistes SuperClaude comme agents OpenCode.

Exemples :

- `security-engineer`
- `frontend-architect`
- `backend-architect`
- `quality-engineer`
- `deep-research-agent`
- `pm-agent`

Cette couche vit dans `.opencode/agents/`.

### 4. Skill Layer

Porte les comportements et methodologies reutilisables en skills OpenCode.

Cette couche sert a :

- factoriser les workflows transverses
- conserver une compatibilite conceptuelle avec le modele SuperClaude
- declencher des instructions denses seulement quand necessaire

Cette couche vit dans `.opencode/skills/`.

### 5. MCP Integration Layer

Mappe les MCP recommandes par SuperClaude vers la config OpenCode.

Serveurs cibles :

- `context7`
- `sequential-thinking`
- `playwright`
- `chrome-devtools`
- `tavily`
- `serena` ou equivalent
- `morph` ou equivalent
- `magic` si la cible produit le justifie

Cette couche vit dans `opencode.json`.

### 6. Plugin Layer

Implante les capacites non couvertes nativement par OpenCode.

Capacites candidates :

- auto-bootstrap des instructions
- compatibilite de workflow SuperClaude
- persistance avancee de session
- resume et restauration de contexte
- auto-documentation post-tache
- alias comportementaux et orchestration

Cette couche vit dans `.opencode/plugins/` et, si publication, dans un package npm dedie.

### 7. Custom Tools Layer

Ajoute les outils specifiques necessaires si le plugin ne suffit pas.

Exemples :

- gestionnaire de snapshot logique de plan
- serializeur de session
- indexeur de repo cible
- moteur d'alias ou de compatibilite

Cette couche vit dans `.opencode/tools/`.

## Flux cible

1. L'utilisateur lance OpenCode dans un projet.
2. OpenCode charge `opencode.json`, `AGENTS.md`, `.opencode/commands`, `.opencode/agents`, `.opencode/skills` et les plugins.
3. L'utilisateur appelle une commande ` /sc-* ` ou interagit via un agent.
4. La commande selectionne l'agent et les instructions adequats.
5. Les MCP et custom tools sont utilises si necessaire.
6. Le plugin capture les evenements utiles pour la persistance, l'orchestration et la documentation.

## Decisions structurantes

- Runtime principal : TypeScript
- Packaging principal : package npm/plugin OpenCode
- Support plateforme : Windows, macOS, Linux des la V1
- Convention de commandes : ` /sc-* `
- Fidelite : compatibilite fonctionnelle forte, pas duplication exacte de Claude Code
- Persistance : avancee des la V1
- Distribution : repo prive d'abord, structure publiable des la conception

## Risques majeurs

- certaines experiences SuperClaude reposent sur des conventions Claude Code non portables a l'identique
- la compatibilite 1:1 des modes comportementaux devra etre recomposee via plusieurs primitives OpenCode
- la persistance de session avancee demandera probablement un plugin dedie et un format interne stable
- la surface MCP peut varier selon l'environnement utilisateur et les cles disponibles

## Convention de mise en oeuvre

- privilegier les primitives natives OpenCode avant d'ajouter du code
- isoler chaque ecart fonctionnel dans une couche plugin ou tool explicite
- documenter les incompatibilites definitives plutot que les masquer
- garder une architecture publiable, testable et modulaire
