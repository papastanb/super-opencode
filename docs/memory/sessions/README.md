# Session Memory Protocol

## Fichiers

- `active.md` : etat de reprise immediate de la session courante
- `archive/` : checkpoints horodates et sauvegardes de jalons

## Checkpoint obligatoire avant compaction

Avant toute compaction de fenetre de contexte :

1. Mettre a jour `sessions/active.md`.
2. Creer un checkpoint horodate dans `sessions/archive/`.
3. Mettre a jour `docs/memory/implementation-plan-tracking.md` si l'avancement du plan a change.
4. Mettre a jour `docs/memory/status.md` si l'etat global du projet a change.
5. Mettre a jour `docs/memory/decisions.md` si une decision durable a ete prise.
6. Ajouter dans `active.md` un resume de reprise tres court.

## Quand creer un checkpoint d'archive

- avant compaction
- avant changement de phase
- apres un jalon important
- avant interruption longue
- avant refactor ou bloc de travail risqué

## Regles

- `active.md` doit rester court et actionnable.
- l'historique detaille va dans `archive/`.
- ne pas dupliquer tout l'historique dans `active.md`.
