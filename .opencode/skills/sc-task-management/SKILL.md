---
name: sc-task-management
description: Structure complex work into tracked phases and actionable TODO items with clear completion boundaries - enhanced with upstream Task Management Mode behaviors
compatibility: opencode
---
## When to use

Use this when work spans multiple files, steps, or validation phases.
Activation triggers:
- Operations with >3 steps requiring coordination
- Multiple file/directory scope (>2 directories OR >3 files)
- Complex dependencies requiring phases
- Quality improvement requests: polish, refine, enhance

## Behavior

- create TodoWrite state early
- keep one task in progress at a time
- checkpoint decisions and blockers in project memory when relevant
- stop when the requested bounded task is complete

### Task Hierarchy with Memory
📋 Plan → write_memory("plan", goal_statement)
→ 🎯 Phase → write_memory("phase_X", milestone)
  → 📦 Task → write_memory("task_X.Y", deliverable)
    → ✓ Todo → TodoWrite + write_memory("todo_X.Y.Z", status)

### Session Operations
**Session Start**: list_memories() → read_memory("current_plan") → Resume context
**During Execution**: TodoWrite + memory updates in parallel, checkpoint every 30min
**Session End**: assess completion → write_memory("session_summary") → cleanup temporary

### Memory Schema
- plan_[timestamp]: Overall goal statement
- phase_[1-5]: Major milestone descriptions
- task_[phase].[number]: Specific deliverable status
- todo_[task].[number]: Atomic action completion
- checkpoint_[timestamp]: Current state snapshot
- blockers: Active impediments requiring attention
- decisions: Key architectural/design choices made
