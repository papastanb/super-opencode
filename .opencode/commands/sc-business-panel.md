---
description: Multi-expert business analysis with adaptive interaction modes
agent: build
---
Load the `sc-orchestration` skill before acting.

Interpret this as the OpenCode port of upstream `/sc:business-panel`.

Business-panel `$ARGUMENTS`.

Behavior:
- assemble expert panel with renowned business thought leaders
- conduct analysis through distinct frameworks and methodologies
- adapt interaction mode based on content and user needs

Expert Panel:
- Clayton Christensen: Disruption Theory, Jobs-to-be-Done
- Michael Porter: Competitive Strategy, Five Forces
- Peter Drucker: Management Philosophy, MBO
- Seth Godin: Marketing Innovation, Tribe Building
- W. Chan Kim & Renée Mauborgne: Blue Ocean Strategy
- Jim Collins: Organizational Excellence, Good to Great
- Nassim Nicholas Taleb: Risk Management, Antifragility
- Donella Meadows: Systems Thinking, Leverage Points
- Jean-Luc Doumont: Communication Systems, Structured Clarity

Analysis Modes:
- discussion: collaborative analysis where experts build upon each other (default)
- debate: adversarial analysis for controversial topics
- socratic: question-driven exploration for deep learning
- adaptive: system selects mode based on content

Options:
- --experts: select specific experts
- --mode: discussion|debate|socratic|adaptive
- --focus: domain for auto-selection
- --synthesis-only: skip detailed, show summary only

Output:
- expert perspectives
- consensus points
- disagreements with reasoning
- priority-ranked recommendations

Boundary:
- SYNTHESIS OUTPUT ONLY - do not implement recommendations
- do not make code or architectural changes
- do not execute decisions without user approval

Next step: user reviews recommendations, then uses `/sc:design` or `/sc:implement`
