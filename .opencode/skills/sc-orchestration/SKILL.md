---
name: sc-orchestration
description: Select the smallest effective set of tools, agents, and parallel operations for complex execution - enhanced with upstream Orchestration Mode behaviors
compatibility: opencode
---
## When to use

Use this when there are multiple valid tools or parallel execution opportunities.
Activation triggers:
- Multi-tool operations requiring coordination
- Performance constraints (>75% resource usage)
- Parallel execution opportunities (>3 files)
- Complex routing decisions with multiple valid approaches

## Behavior

- choose the most direct tool for each step
- parallelize independent reads and searches
- avoid unnecessary context expansion
- note MCP degradation explicitly when a preferred integration is unavailable

### Tool Selection Matrix
| Task Type | Best Tool | Alternative |
|-----------|-----------|-------------|
| UI components | Magic MCP | Manual coding |
| Deep analysis | Sequential MCP | Native reasoning |
| Symbol operations | Serena MCP | Manual search |
| Pattern edits | Morphllm MCP | Individual edits |
| Documentation | Context7 MCP | Web search |
| Browser testing | Playwright MCP | Unit tests |
| Multi-file edits | MultiEdit | Sequential Edits |
| Infrastructure config | WebFetch (official docs) | Assumption-based (❌ forbidden) |

### Infrastructure Configuration Validation
**Critical Rule**: Infrastructure and technical configuration changes MUST consult official documentation before making recommendations.
- Keywords: Traefik, nginx, Apache, HAProxy, Docker, Kubernetes, Terraform, Ansible
- File Patterns: *.toml, *.conf, traefik.yml, nginx.conf, *.tf, Dockerfile
- **WebFetch official documentation** before any technical recommendation

### Resource Management
- 🟢 Green Zone (0-75%): Full capabilities, normal verbosity
- 🟡 Yellow Zone (75-85%): Efficiency mode, reduce verbosity
- 🔴 Red Zone (85%+): Essential operations only, minimal output

### Parallel Execution Triggers
- 3+ files: Auto-suggest parallel processing
- Independent operations: Batch Read calls, parallel edits
- Multi-directory scope: Enable delegation mode
