import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

export const safeRead = async (filePath: string) => {
  try {
    return await readFile(filePath, 'utf8')
  } catch {
    return ''
  }
}

export const safeWrite = async (filePath: string, content: string) => {
  try {
    const dir = path.dirname(filePath)
    await mkdir(dir, { recursive: true })
    await writeFile(filePath, content, 'utf8')
    return true
  } catch {
    return false
  }
}

export const getMemorySnapshot = async (worktree: string) => {
  const active = await safeRead(path.join(worktree, 'docs/memory/sessions/active.md'))
  const status = await safeRead(path.join(worktree, 'docs/memory/status.md'))
  const tracking = await safeRead(path.join(worktree, 'docs/memory/implementation-plan-tracking.md'))

  return { active, status, tracking }
}

export const persistenceContract = [
  'Serena is the persistence source of truth for this project.',
  'Use Serena memory keys `pm_context`, `current_plan`, `last_session`, `next_actions`, `checkpoint`, `decision`, and `summary` when relevant.',
  'For hierarchical task tracking: plan_[timestamp], phase_[1-5], task_[phase].[number], todo_[task].[number], checkpoint_[timestamp].',
  '`docs/memory/` is the human-readable projection and degraded fallback, not the primary persistence layer.',
  'When Serena is unavailable, state clearly that the session is operating in degraded persistence mode.',
].join(' ')

export const commandPersistenceHint = [
  'For `/sc-pm`, `/sc-save`, `/sc-load`, and `/sc-reflect`, prefer Serena memory tools first.',
  'For complex tasks: write_memory("plan_[timestamp]", goal_statement) → write_memory("phase_X", milestone) → write_memory("task_X.Y", deliverable).',
  'Project to `docs/memory/` only on meaningful lifecycle events such as `sc-save`, stale `sc-load`, checkpoints, major milestones, or durable decisions.',
  'Do not mirror every transient Serena write into `docs/memory/`.',
].join(' ')

export const checkpointTemplate = (phase: string, goal: string) => [
  `# Checkpoint ${new Date().toISOString().split('T')[0]}`,
  '',
  `## Phase: ${phase}`,
  '',
  `## Goal: ${goal}`,
  '',
  '## Progress',
  '- [ ] Task 1',
  '- [ ] Task 2',
  '',
  '## Blockers',
  '- None',
  '',
  '## Next Actions',
  '- Continue with next task',
].join('\n')

export const autoCheckpointHint = [
  'Consider creating a checkpoint with `/sc-save` every 30 minutes for long operations.',
  'Use `/sc-pm` to summarize current progress before pausing.',
].join(' ')
