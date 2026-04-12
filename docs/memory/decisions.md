# Decisions

## Durable Decisions

### 2026-04-10

- Le portage cible une compatibilite fonctionnelle forte, pas un clone exact de Claude Code.
- Les commandes utilisateur utilisent la convention ` /sc-* ` dans OpenCode.
- La V1 doit etre cross-platform.
- La V1 inclut une persistance avancee.
- La structure doit etre publiable plus tard, meme si le repo reste prive au depart.

### 2026-04-11

- Serena devient la source de verite de la persistance du framework.
- `docs/memory/` devient la projection humaine durable et le fallback degrade de la persistance.
- Le contexte Serena OpenCode utilise `ide` avec `--project-from-cwd`.
- Le port local de `sc-reflect` degrade vers les outils memoire Serena exposes quand les outils de reflexion dedies ne sont pas disponibles.
- La sync V1 Serena -> `docs/memory/` reste limitee et declenchee par evenements, sans replication automatique complete.
- `PROJECT_INDEX.md` et `PROJECT_INDEX.json` restent des sorties generees a la demande et ne sont pas des artefacts versionnes V1.
