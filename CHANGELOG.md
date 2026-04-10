# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-11

### Added

**Core Framework**
- 28 `/sc-*` commands ported from SuperClaude
- 15 specialized agents (pm-agent, system-architect, frontend-architect, etc.)
- 6 mode-support skills (sc-brainstorming, sc-introspection, sc-deep-research, sc-task-management, sc-orchestration, sc-token-efficiency)

**Persistence**
- Serena MCP integration as primary persistence layer
- Plugin hooks for automatic checkpoint hints
- Command hints for persistence commands (sc-pm, sc-save, sc-load, sc-reflect)
- Hierarchical task memory schema (plan → phase → task → todo)

**Plugin Engine**
- System hooks for persistence contract injection
- Command hooks for hints before execution
- Compaction hooks for session context preservation
- Auto-checkpoint template and hints

**Packaging**
- Complete package.json with exports and peerDependencies
- Cross-platform validation script
- Installation project script
- Example configurations

**Tests**
- Bun test suite for framework structure validation

### Features

- Phase 0: Foundation - TypeScript/Bun project setup
- Phase 1: Core Compatibility - Commands, agents, skills, MCP config
- Phase 2: Behavioral Reconstruction - Enhanced modes with upstream behaviors
- Phase 3: Plugin Engine - Hooks, persistence, checkpoints
- Phase 4: Advanced Features - sc-spawn, sc-recommend
- Phase 5: Packaging - npm-ready, cross-platform validated

### Commands Added

| Category | Commands |
|----------|----------|
| Workflow | sc-brainstorm, sc-design, sc-implement |
| Diagnostic | sc-analyze, sc-troubleshoot |
| Quality | sc-test, sc-document |
| Research | sc-research |
| Orchestration | sc-task, sc-workflow, sc-agent, sc-spawn |
| PM | sc-pm, sc-help, sc-recommend, sc-index, sc-index-repo |
| Persistence | sc-save, sc-load, sc-reflect |
| Utility | sc-estimate, sc-build, sc-improve, sc-cleanup, sc-explain, sc-git, sc-select-tool, sc-business-panel |

### MCP Configuration

- **serena**: Enabled (required for persistence)
- **context7**: Recommended (documentation)
- **sequential**: Recommended (reasoning)
- **playwright**: Optional (testing)
- **tavily**: Optional (research)
- **morph**: Optional (fast edits)

### Dependencies

- @opencode-ai/plugin: ^1.4.0 (peer)
- bun: 1.3.9+
- typescript: ^5.9.2
- @types/node: ^24.3.0

## [0.1.0] - 2026-04-10

### Added

- Initial project scaffolding
- Basic command structure
- README and ARCHITECTURE documentation

---

## Future Considerations

- GitHub Actions CI/CD pipeline
- Automated releases
- npm publication
- Additional test coverage
- Public repository