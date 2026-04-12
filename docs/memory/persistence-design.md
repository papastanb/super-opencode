# Persistence Design

Design de la persistance avancee V1, y compris `sc-save`, `sc-load`, checkpoints et reprise de session.

## Decision principale

Serena devient la source de verite de la persistance du framework.

`docs/memory/` reste une projection humaine durable pour :

- reprise lisible sans MCP
- documentation de l'etat courant
- checkpoints de compaction et de handoff

## Repartition des roles

### Serena

Responsable de :

- contexte de session courant
- checkpoints exploitables par l'agent
- plan courant et prochaines actions
- resume de session precedent
- learnings, patterns et mistakes si capture explicite

### docs/memory/

Responsable de :

- status global du projet
- suivi lisible du plan d'implementation
- resume de session actif
- decisions durables destinees aux humains et aux futurs agents

## Schema de cles Serena V1

### Cles coeur

- `pm_context`
  - etat global exploitable par `sc-pm` et `pm-agent`
- `current_plan`
  - objectif courant, phase, sous-objectifs, commandes a utiliser
- `last_session`
  - resume du travail precedent
- `next_actions`
  - prochaines etapes concretes
- `checkpoint`
  - dernier snapshot de progression

### Cles complementaires

- `decision`
  - rationale durable recente quand elle doit etre rejouable
- `summary`
  - resume de cloture ou de save explicite
- `learning/patterns/<name>`
  - pattern valide a reutiliser
- `learning/mistakes/<name>`
  - erreur documentee avec prevention

## Flux V1

### sc-load

1. utiliser Serena pour `list_memories`
2. lire `pm_context`, `current_plan`, `last_session`, `next_actions`
3. produire un resume court de reprise
4. synchroniser la projection humaine dans `docs/memory/` si necessaire

### sc-pm

1. restaurer le contexte Serena en priorite
2. completer si besoin par `docs/memory/`
3. resumer `previous`, `progress`, `next`, `blockers`
4. proposer ou orchestrer l'etape suivante

### sc-save

1. analyser l'etat courant et les changements significatifs
2. ecrire au minimum `last_session`, `next_actions`, `pm_context`
3. ecrire `checkpoint` si la session est longue ou complexe
4. mettre a jour la projection humaine `docs/memory/`

### sc-reflect

1. appeler les outils Serena de reflexion si disponibles
2. evaluer adherence, completude et statut de fin
3. enregistrer les conclusions utiles dans `summary`, `decision` ou un espace `learning/*`

## Regles de synchronisation

- Serena prime sur `docs/memory/` en cas de divergence courte duree
- `docs/memory/` doit etre remis a jour apres `sc-save` et apres tout jalon important
- si Serena est indisponible, le framework degrade vers `docs/memory/`, mais cet etat est considere comme mode degrade

## Politique V1 de projection

La synchronisation V1 est volontairement limitee et declenchee par evenements.

Objectif :

- garder Serena comme seule source de verite operationnelle
- conserver `docs/memory/` lisible et utile pour les humains
- eviter une duplication bruyante ou une pseudo-replication de base de donnees

### Ownership

Serena possede en priorite :

- `pm_context`
- `current_plan`
- `last_session`
- `next_actions`
- `checkpoint`
- `summary`
- `learning/*`

`docs/memory/` possede en priorite :

- `status.md`
- `implementation-plan-tracking.md`
- `sessions/active.md`
- `decisions.md`
- `sessions/archive/*`

### Evenements qui declenchent une projection vers `docs/memory/`

- `sc-save`
- `sc-load` si la projection humaine est stale ou incomplete
- checkpoint avant compaction
- jalon important ou changement de phase
- nouvelle decision durable qui doit survivre cote humain

### Evenements qui ne declenchent pas de projection complete

- update transitoire de `next_actions`
- raffinement mineur de `pm_context`
- write Serena de travail intermediaire sans changement de trajectoire
- generation d'artefacts auxiliaires comme `PROJECT_INDEX.md` et `PROJECT_INDEX.json`

### Regle de staleness V1

La projection humaine est consideree stale si au moins un de ces cas apparait :

- la derniere reprise Serena contredit le resume actif dans `sessions/active.md`
- un `sc-save`, `sc-load` ou checkpoint a modifie materialement le chemin de reprise
- une decision durable recente n'a pas ete projete dans `decisions.md`
- le statut global ou le suivi de phase n'est plus coherent avec `pm_context` ou `current_plan`

V1 ne requiert pas de timestamp systematique ni de diff automatique entre Serena et `docs/memory/`.

### Mapping minimal V1

- `sc-save` : ecrit Serena d'abord, puis met a jour `sessions/active.md` et au besoin `status.md` ou `implementation-plan-tracking.md`
- `sc-load` : lit Serena d'abord, puis rafraichit `docs/memory/` seulement si l'etat humain est stale
- `sc-pm` : peut ecrire Serena pour clarifier le contexte, mais ne projette vers `docs/memory/` qu'a un checkpoint, un jalon, ou si le chemin de reprise change materialement
- `sc-reflect` : ecrit `summary`, `decision` ou `learning/*` dans Serena; ne promeut vers `docs/memory/` que les conclusions durables ou utiles a la reprise humaine

### Artefacts auxiliaires

Les fichiers `PROJECT_INDEX.md` et `PROJECT_INDEX.json` sont des sorties de commande utiles a l'exploration. En V1, ils ne font pas partie de la projection de persistance et ne doivent pas etre synchronises automatiquement avec Serena.

## Integration plugin V1

Le plugin local ne remplace pas Serena.

Il sert a :

- injecter le contrat de persistance dans le systeme de chat
- renforcer les commandes `sc-pm`, `sc-save`, `sc-load`, `sc-reflect`
- enrichir la compaction avec la projection humaine et les rappels de persistance

## Limites V1

- pas de replication automatique complete de toutes les memories Serena vers `docs/memory/`
- pas de hook plugin garanti sur "session end" pour ecriture Serena sans passer par les commandes/workflows agentiques
- les writes Serena restent portes par les outils MCP utilises par l'agent, pas par le plugin directement
- pas de detection automatique robuste de staleness au-dela de regles simples liees aux evenements et aux ecarts visibles
