---
description: Create or update project documentation indexes and navigable structure summaries
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:index`.

Index `$ARGUMENTS`.

Behavior:
- inspect project structure, documentation, configuration, and tests before writing anything
- preserve existing manual documentation where possible
- generate concise, navigable documentation artifacts rather than exhaustive prose
- use TodoWrite if the indexing work spans multiple outputs

Potential outputs:
- structure overview
- docs index
- API index
- README-oriented summary

Boundary:
- do not overwrite manual docs without clear reason or explicit user intent
