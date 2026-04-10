---
description: Diagnose bugs, build failures, regressions, and runtime issues
agent: build
---
Load the `sc-introspection` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:troubleshoot`.

Troubleshoot `$ARGUMENTS`.

Rules:
- diagnose first
- gather evidence before proposing fixes
- form and test hypotheses systematically
- only apply fixes when the user clearly wants resolution, not diagnosis only
- if the request includes an explicit fix intent, still present the diagnosis before editing

Required output when staying in diagnosis mode:
- issue summary
- likely root cause
- evidence gathered
- ranked fix options
- risk notes

Boundary:
- do not modify files in diagnosis-only mode
