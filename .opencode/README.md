# OpenCode Config Layer

## Role

Cette arborescence contient la couche OpenCode du framework Super OpenCode:

- `commands/` pour les commandes ` /sc-* ` (28 commandes)
- `agents/` pour les agents portés depuis SuperClaude (15 agents)
- `skills/` pour les comportements chargeables a la demande (6 skills)
- `plugins/` pour le moteur d'integration et de persistance
- `tools/` pour les outils custom si necessaire

## Commands

28 commandes disponibles:
- /sc-brainstorm, /sc-design, /sc-implement, /sc-analyze, /sc-troubleshoot
- /sc-test, /sc-document, /sc-research, /sc-task, /sc-workflow
- /sc-agent, /sc-pm, /sc-help, /sc-recommend, /sc-index, /sc-index-repo
- /sc-save, /sc-load, /sc-reflect
- /sc-estimate, /sc-build, /sc-improve, /sc-cleanup, /sc-explain
- /sc-git, /sc-select-tool, /sc-spawn, /sc-business-panel

## Agents

15 agents disponibles:
- pm-agent, system-architect, backend-architect, frontend-architect
- devops-architect, security-engineer, performance-engineer
- root-cause-analyst, quality-engineer, refactoring-expert
- python-expert, requirements-analyst, technical-writer
- learning-guide, deep-research-agent

## Skills

6 skills de modes:
- sc-brainstorming, sc-introspection, sc-deep-research
- sc-task-management, sc-orchestration, sc-token-efficiency

## Persistence

Serena MCP est activé par défaut. Clés principales:
- pm_context, current_plan, last_session, next_actions
- checkpoint, decision, summary

Utilisez /sc-pm, /sc-save, /sc-load, /sc-reflect pour la gestion de contexte.
