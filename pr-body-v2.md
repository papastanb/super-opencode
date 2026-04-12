## Summary

Complete Super OpenCode framework v1.0.0 release - porting from SuperClaude to OpenCode.

### System Features

- **28 commands** `/sc-*` ported from SuperClaude
- **15 agents** (pm-agent, system-architect, etc.)
- **6 skills** with upstream mode behaviors
- **Serena MCP** integration for persistence
- **Plugin engine** with hooks (system, command, compaction)
- **Package-ready scaffold** with validated exports and install flow
- **Scaffold validation** in CI and release checks
- **Test suite** (15 tests passing)
- **CodeRabbit** config for automated reviews

### Changes in this PR

- Added `.coderabbit.yaml` for automated code review
- Added `lint` script to `package.json`

### Test Results

```
15 pass, 0 fail
Ran 15 tests across 1 file
```

---
*Ready for review by Qodo, Devin, and CodeRabbit agents*
