# Contributing to Super OpenCode

Thanks for contributing.

## Before You Start

- Read `README.md` for the public package scope.
- Read `AGENTS.md` for repo-specific working rules.
- Keep the main files short and avoid committing session notes, private checkpoints, or other maintainer-only scratch files.

## Contribution Scope

This repository has two roles:

- the source repository for developing Super OpenCode
- the npm package that exposes Super OpenCode as an OpenCode plugin and includes bundled `/sc-*` assets plus local sync support

When contributing, keep the published package contract separate from repo-only planning or memory files.

## Reporting Issues

Open a GitHub issue and include:

- what you tried
- what happened
- what you expected
- your environment: OS, Node version, Bun version, OpenCode version

If the issue is about installation, include whether you installed through OpenCode (`Ctrl+P` -> `plugins` -> `Shift+I` -> `super-opencode-framework`) or through the manual CLI path (`bunx super-opencode-framework install` / `npx super-opencode-framework install`).

## Pull Requests

1. Fork the repository.
2. Create a topic branch from `main`.
3. Make the smallest correct change.
4. Add or update tests when behavior changes.
5. Update public docs when the package contract or user-facing behavior changes.
6. Run the relevant checks.
7. Open a pull request with a clear rationale.

## Validation

Run the checks that match your change:

```bash
bun run check
bun test
bun run release:check
```

Use `bun run release:check` for anything that could affect the published package, installer, or package metadata.

## Code Guidelines

- TypeScript is the main implementation language.
- Prefer minimal, direct changes over speculative abstractions.
- Preserve command boundaries: planning commands plan, implementation commands implement, diagnostic commands diagnose.
- Do not hard-code a rigid `/sc-*` mapping where the framework is intended to recommend or route dynamically.
- Document why when behavior would otherwise be unclear.

## Commit Messages

Conventional Commits are preferred.

Examples:

```bash
git commit -m "feat: add installer support for project config updates"
git commit -m "fix: harden package exports for npm release"
git commit -m "docs: align public usage guides with current command routing"
```

## Review Expectations

- CI should pass.
- User-facing claims should match the actual package behavior.
- Public docs should stay in English.
- Maintainer scratch files, local review drafts, and private notes should not be committed.

## Community Standards

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
