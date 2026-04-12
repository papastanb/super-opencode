# Tooling Research

## Objectif

Identifier et installer l'outillage utile au developpement de Super OpenCode sans court-circuiter les composants que ce projet doit lui-meme implementer.

## Skills externes reperes

- `igorwarzocha/opencode-workflows@create-opencode-plugin`
  - utile pour patterns de plugin OpenCode
- `siviter-xyz/dot-agent@typescript`
  - utile pour conventions TypeScript
- `petekp/agent-skills@agent-changelog`
  - utile pour changelog et historique de releases
- `mblode/agent-skills@define-architecture`
  - utile pour arbitrages architecture si necessaire

## Plugins OpenCode reperes

### A envisager pour le developpement

- `opencode-shell-strategy`
  - utile pour eviter les hangs shell non interactifs
- `opencode-morph-plugin`
  - utile pour fast apply et recherche avancee pendant le developpement
- `opencode-notify`
  - utile pour feedback de fin de tache

### A ne pas installer tout de suite

- `opencode-supermemory`
  - conflit potentiel avec notre propre couche de persistance
- `opencode-skillful`
  - recouvre partiellement le systeme de skills natif et notre architecture cible
- `@openspoon/subtask2`
  - peut influencer l'orchestration que nous voulons concevoir nous-memes
- `opencode-background-agents`
  - recouvre un pan du moteur d'orchestration cible

## LSP necessaires

- `typescript`
  - requis pour `.ts`
  - active des que `typescript` est une dependance du projet
- `eslint`
  - utile plus tard si le projet ajoute `eslint`
- `yaml-ls`
  - utile si la configuration MCP ou CI devient plus riche

## Decisions actuelles

- installer les skills externes utiles a la construction
- ne pas installer pour l'instant les plugins OpenCode qui remplaceraient nos features coeur
- activer le LSP TypeScript via la dependance `typescript` du projet

## Installed

### Skills

- `igorwarzocha/opencode-workflows@create-opencode-plugin`
- `siviter-xyz/dot-agent@typescript`
- `petekp/agent-skills@agent-changelog`

Note:

- `agent-changelog` a remonte un signal generatif `High Risk` a l'installation. Skill conservee, mais usage prudent requis.

### Plugins OpenCode tiers

- aucun installe a ce stade

### LSP

- LSP TypeScript active indirectement via la dependance `typescript` du projet et le support builtin d'OpenCode

## Next Steps

- completer la foundation avec les premieres vraies commandes, agents et skills du projet
- reevaluer plus tard les plugins tiers non concurrents si un besoin concret apparait
