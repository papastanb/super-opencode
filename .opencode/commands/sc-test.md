---
description: Discover and run relevant tests, then explain failures
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:test`.

Test `$ARGUMENTS`.

Behavior:
- detect available test or validation commands from the repo
- run the smallest relevant verification first, then widen if useful
- summarize failures with likely causes and next actions
- use browser-oriented tooling only when the task clearly needs e2e or UI validation
- report coverage when explicitly requested or readily available
- keep the result tied to existing tests and project runners

Boundary:
- do not silently rewrite tests unrelated to the user task
