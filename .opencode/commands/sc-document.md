---
description: Generate or update targeted documentation and code comments
agent: build
---
Interpret this as the OpenCode port of upstream `/sc:document`.

Document `$ARGUMENTS`.

Behavior:
- inspect target code and nearby docs first
- document why and how, not obvious implementation trivia
- prefer concise, maintainable documentation
- preserve project tone and conventions
- tailor the output to the likely audience: implementer, maintainer, or end user

Targets may include:
- inline code comments
- JSDoc or API notes
- guides or reference docs
- project memory updates when relevant

Boundary:
- do not invent undocumented behavior; base documentation on code, source docs, or explicit user intent
