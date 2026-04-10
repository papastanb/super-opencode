---
name: sc-token-efficiency
description: Keep outputs compressed, structured, and high-signal when context pressure or scale increases - enhanced with upstream Token Efficiency Mode behaviors
compatibility: opencode
---
## When to use

Use this for large operations, verbose contexts, or explicit brevity requests.
Activation triggers:
- Context usage >75% or resource constraints
- Large-scale operations requiring efficiency
- User requests brevity: `--uc`, `--ultracompressed`
- Complex analysis workflows needing optimization

## Behavior

- compress wording without dropping important facts
- prefer lists and status markers over long prose
- keep evidence and next actions visible
- **Symbol Communication**: Use visual symbols for logic, status, and technical domains

### Symbol Systems

#### Core Logic & Flow
| Symbol | Meaning | Example |
|--------|---------|----------|
| → | leads to, implies | `auth.js:45 → 🛡️ security risk` |
| ⇒ | transforms to | `input ⇒ validated_output` |
| ← | rollback, reverse | `migration ← rollback` |
| ⇄ | bidirectional | `sync ⇄ remote` |
| & | and, combine | `🛡️ security & ⚡ performance` |
| \| | separator, or | `react\|vue\|angular` |
| : | define, specify | `scope: file\|module` |
| » | sequence, then | `build » test » deploy` |
| ∴ | therefore | `tests ❌ ∴ code broken` |
| ∵ | because | `slow ∵ O(n²) algorithm` |

#### Status & Progress
| Symbol | Meaning | Usage |
|--------|---------|-------|
| ✅ | completed, passed | Task finished successfully |
| ❌ | failed, error | Immediate attention needed |
| ⚠️ | warning | Review required |
| 🔄 | in progress | Currently active |
| ⏳ | waiting, pending | Scheduled for later |
| 🚨 | critical, urgent | High priority action |

#### Technical Domains
| Symbol | Domain | Usage |
|--------|---------|-------|
| ⚡ | Performance | Speed, optimization |
| 🔍 | Analysis | Search, investigation |
| 🔧 | Configuration | Setup, tools |
| 🛡️ | Security | Protection, safety |
| 📦 | Deployment | Package, bundle |
| 🎨 | Design | UI, frontend |
| 🏗️ | Architecture | System structure |

### Abbreviation Systems

**System & Architecture**: cfg config • impl implementation • arch architecture • perf performance • ops operations • env environment
**Development Process**: req requirements • deps dependencies • val validation • test testing • docs documentation • std standards
**Quality & Analysis**: qual quality • sec security • err error • rec recovery • sev severity • opt optimization

### Compression Target
- 30-50% token reduction while preserving ≥95% information quality
