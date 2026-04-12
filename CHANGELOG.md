# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Reframed the npm package as an installable scaffold for existing OpenCode projects rather than a raw mirror of this repository.
- Aligned public documentation around the current runtime contract: Node.js 24+, Bun 1.3.9+, and OpenCode.
- Clarified that `/sc-*` commands keep explicit boundaries while still allowing dynamic recommendation and routing instead of a rigid command mapping.

### Fixed

- Hardened npm packaging with a TypeScript build to `dist/` and valid package exports.
- Moved `@opencode-ai/plugin` to runtime dependencies so the published package remains consumable.
- Added release validation with `bun run release:check`.
- Updated CI to modern GitHub Actions and Node 24.

### Added

- `super-opencode install` scaffold flow for copying runtime assets into an existing OpenCode project.
- Public-facing English docs for installation, usage, architecture, commands, and contribution guidance.
- Plugin hook tests covering the scaffolded runtime behavior.
- `CODE_OF_CONDUCT.md`.

## [1.0.0] - 2026-04-11

### Added

- Initial Super OpenCode framework release with 28 `/sc-*` commands.
- Specialist agent prompts under `.opencode/agents/`.
- Mode support skills under `.opencode/skills/`.
- Serena-first persistence guidance and plugin hook scaffolding.
- Repository documentation, examples, tests, and packaging foundation.

## [0.1.0] - 2026-04-10

### Added

- Initial project scaffolding.
- Basic command structure.
- Early repository documentation.
