# Active Session

## Objective

Checkpoint apres hardening release/public et reprise de la vague 2 de polish.

## Current Phase

Hardening pre-publication: revue finale go/no-go passee, base prete pour commit.

## Working Set

- `AGENTS.md`
- `README.md`
- `INSTALL.md`
- `package.json`
- `.github/workflows/ci.yml`
- `scripts/install-project.mjs`
- `scripts/validate-package.mjs`
- `tests/plugin-hooks.test.mjs`
- `tsconfig.build.json`
- `CODE_OF_CONDUCT.md`
- `CONTRIBUTING.md`
- `COMMANDS.md`
- `USAGE.md`
- `ARCHITECTURE.md`
- `CHANGELOG.md`
- `docs/memory/`

## Decisions In Force

- fichiers principaux tres courts
- details deplaces dans les memoires secondaires
- checkpoint obligatoire avant compaction
- ne pas installer de plugins OpenCode tiers qui remplacent prematurement notre moteur coeur
- la foundation est validee, la suite porte sur commandes et agents prioritaires
- la source de comportement a porter est le framework SuperClaude upstream et sa documentation publique
- le plan local est realigne sur l'upstream pour les ecarts structurants
- `pm-agent` entre dans le premier lot de Phase 1
- les modes upstream auront un support minimal des la Phase 1 via `.opencode/skills/`
- le premier lot de commandes ` /sc-* ` prioritaires est cree
- le lot commandes est etendu avec `sc-pm`, `sc-help`, `sc-recommend`, `sc-index`, `sc-index-repo`
- `sc-save`, `sc-load` et `sc-reflect` sont ajoutes
- les agents coeur et `pm-agent` sont crees
- Serena est active et connectee dans le projet
- les commandes Phase 1 ont ete raffinees pour coller davantage aux frontieres upstream
- la persistance utilise Serena comme source de verite et `docs/memory/` comme projection humaine
- la branche par defaut GitHub est revenue sur `main` et les releases se gerent par tags
- le contrat public vise des projets OpenCode avec Node 24 + Bun
- le package npm est maintenant traite comme un scaffold installable, pas seulement comme la repo locale
- la directive globale OpenCode utilisateur vit dans `C:/Users/P52/.config/opencode/AGENTS.md`

## Last Completed

- integration de la directive tooling globale OpenCode
- mise a jour de la CI vers Node 24 et actions modernes
- suppression du job PR fragile de labels
- correction du packaging npm via build `dist/`, `exports` valides et dependance runtime plugin SDK
- ajout du CLI `super-opencode install`
- ajout de `bun run release:check`
- reecriture publique de `README.md` et `INSTALL.md` en anglais
- ajout de `CODE_OF_CONDUCT.md`
- ajout de tests plugin hooks
- validation locale `bun test` et `bun run release:check`
- commits pousses sur `main` et `release/v1.0.0`

## Next Steps

- arbitrer si `agent: build` reste un routeur documente ou si les commandes doivent avoir des agents specialises en frontmatter
- preparer le commit de la vague finale de polish public
- decider du moment exact de publication npm et de mise en public du repo

## Open Questions

- faut-il assainir immediatement la cle Morph en clair du config global OpenCode utilisateur

## Risks

- eviter les conflits entre outillage tiers et le moteur que nous voulons construire
- laisser subsister une incoherence entre le contrat public modeste du plugin/package et certains libelles internes

## Compaction Resume Prompt

Repo Super OpenCode : checkpoint pris apres hardening release/public puis vague 2 de polish public. La branche par defaut GitHub est `main`. La CI cible `main` avec Node 24, `actions/checkout@v6`, `actions/setup-node@v6` et `oven-sh/setup-bun@v2`. Le package npm construit `dist/`, expose un plugin consommable et fournit un CLI `super-opencode install`. `README.md`, `INSTALL.md`, `CONTRIBUTING.md`, `COMMANDS.md`, `USAGE.md`, `ARCHITECTURE.md` et `CHANGELOG.md` sont alignes en anglais avec le contrat public actuel. `.opencode/README.md` a ete retire du tarball. La validation release utilise `npm pack --dry-run --json --loglevel=error` pour eviter un warning npm 11 non bloquant. `bun run check`, `bun test`, `bun run release:check` et `npm pack --dry-run --loglevel=error` passent. Verdict actuel : go pour commit et preparation de publication, sans bloqueur detecte.

## Resume Reprise

Le hardening principal est termine et pousse. La prochaine reprise peut attaquer directement le commit de cette vague finale puis la preparation de publication.
