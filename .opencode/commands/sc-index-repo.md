---
description: Generate a compact repository index for faster future exploration
agent: build
---
Load the `sc-token-efficiency` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:index-repo`.

Create or update a compact repository index for `$ARGUMENTS`.

Behavior:
- analyze source files, documentation, configuration, tests, and scripts
- identify entry points, key modules, config surfaces, and test locations
- generate a human-readable summary and a machine-oriented summary when useful
- optimize for future session reuse and low-context exploration cost

Default outputs:
- `PROJECT_INDEX.md`
- `PROJECT_INDEX.json`

Boundary:
- keep the index compact and navigable
- do not attempt a full architecture rewrite while indexing
