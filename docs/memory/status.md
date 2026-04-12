# Project Status

## Current State

- Project: Super OpenCode
- Goal: portage complet de SuperClaude vers OpenCode
- Current phase: hardening pre-publication et packaging npm
- Overall status: release hardening principal termine, base publique alignee sur `main`

## Done

- analyse initiale du portage SuperClaude -> OpenCode
- creation du repo GitHub prive
- initialisation du repo local git
- creation de `README.md`, `ARCHITECTURE.md`, `docs/PORTING_PLAN.md`
- creation du systeme memoire du projet
- scaffold initial de la foundation
- recherche outillage skills/plugins/LSP
- installation des skills externes retenues
- validation du scaffold via `bun run check`
- realignement du plan local sur la source upstream SuperClaude
- clonage local de `SuperClaude_Framework` dans `upstream-superclaude/` pour reference de portage
- creation du fichier d'instructions OpenCode dedie
- creation du premier lot de commandes ` /sc-* ` prioritaires
- extension du lot commandes avec `sc-pm`, `sc-help`, `sc-recommend`, `sc-index`, `sc-index-repo`
- ajout de `sc-save`, `sc-load` et `sc-reflect`
- creation des agents coeur et de `pm-agent`
- creation des skills de support minimaux pour les modes prioritaires
- ajout d'un skeleton MCP documente dans `opencode.json`
- validation du noyau Phase 1 via `bun run check`
- raffinement comportemental des commandes Phase 1 a partir des sources upstream detaillees
- definition du contrat de persistance dans `docs/memory/persistence-design.md`
- activation reelle de Serena dans `opencode.json`
- validation runtime de Serena via `opencode mcp list`
- refactor du plugin local pour injecter le contrat de persistance Serena
- integration d'une directive globale OpenCode dans `~/.config/opencode/AGENTS.md` (ou `%USERPROFILE%/.config/opencode/AGENTS.md` sur Windows)
- bascule de la branche par defaut GitHub vers `main`
- mise a jour de la CI vers Node 24 (`actions/checkout@v6`, `actions/setup-node@v6`, `oven-sh/setup-bun@v2`)
- suppression du job PR fragile de labellisation
- correction du packaging npm avec build TS -> `dist/` et `exports` valides
- passage de `@opencode-ai/plugin` en dependance runtime
- ajout d'un installateur CLI `super-opencode install`
- ajout d'une validation de release package via `bun run release:check`
- reecriture publique de `README.md` et `INSTALL.md` en anglais
- ajout de `CODE_OF_CONDUCT.md`
- ajout de tests plugin hooks et validation locale reussie (`bun test`, `bun run release:check`)
- corrections committees et poussees sur `main` et `release/v1.0.0`

## In Progress

- arbitrage restant sur le role de `agent: build` comme routeur vs frontmatters specialises

## Next

- choisir le nom/version npm de publication, le nom `super-opencode` etant deja pris sur le registry
- s'authentifier a npm sur la machine de release avant publication reelle
- assainir la cle Morph en clair du config OpenCode utilisateur avant exposition plus large de l'environnement
  owner: release prep
  due: avant toute publication publique ou partage plus large de l'environnement
- aligner les derniers libelles internes avec le contrat public modeste du package/plugin
  owner: repo maintenance
  due: avant la prochaine passe de documentation interne

## Risks

- certaines experiences Claude Code devront etre recomposees plutot que copiees
- la persistance avancee V1 demandera un design stable des le debut
- ne pas introduire trop tot des plugins tiers qui doublonnent les features coeur du framework
- `opencode mcp list` expose aussi un `morph-mcp` global connecte hors config projet, a garder a l'oeil pour eviter les confusions de surface outil

## Session Handoff

- checkpoint release/public effectue apres corrections CI, packaging npm et installation
- les docs publiques restantes (`CONTRIBUTING.md`, `COMMANDS.md`, `USAGE.md`, `ARCHITECTURE.md`, `CHANGELOG.md`) ont ete realignees en anglais
- `.opencode/README.md` a ete retire du package surface et `bun run release:check` repasse
- revue finale go/no-go effectuee: pas de bloqueur detecte sur le package, la doc publique ou la validation locale
- le commit final de polish public a ete pousse sur `main` (`ad99264`)
- `npm publish --dry-run --tag next --loglevel=error` passe, mais la publication reelle reste bloquee par le nom npm deja pris, la version locale `1.0.0` et l'absence d'authentification npm sur la machine
- etat actuel: package et documentation publique alignes, base prete pour arbitrage nom/version npm puis publication
