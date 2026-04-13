export const persistenceContract = [
  'Serena is the persistence source of truth for this project.',
  'Use Serena memory keys `pm_context`, `current_plan`, `last_session`, `next_actions`, `checkpoint`, `decision`, and `summary` when relevant.',
  'For hierarchical task tracking: plan_[timestamp], phase_[1-5], task_[phase].[number], todo_[task].[number], checkpoint_[timestamp].',
  'When Serena is unavailable, state clearly that the session is operating in degraded persistence mode.',
].join(' ')

export const commandPersistenceHint = [
  'For `/sc-pm`, `/sc-save`, `/sc-load`, and `/sc-reflect`, prefer Serena memory tools first.',
  'For complex tasks: write_memory("plan_[timestamp]", goal_statement) → write_memory("phase_X", milestone) → write_memory("task_X.Y", deliverable).',
  'Use repo files only for public, durable documentation; keep session continuity in Serena rather than committed scratch files.',
].join(' ')

export const autoCheckpointHint = [
  'Consider creating a checkpoint with `/sc-save` every 30 minutes for long operations.',
  'Use `/sc-pm` to summarize current progress before pausing.',
].join(' ')
