import { getMemorySnapshot, persistenceContract, autoCheckpointHint } from './memory.js'

export const createCompactionHooks = (worktree: string) => ({
  'experimental.session.compacting': async (_input: unknown, output: { context: string[] }) => {
    const { active, status, tracking } = await getMemorySnapshot(worktree)

    output.context.push(
      [
        '## Super OpenCode Memory',
        'Before compacting, make sure the mandatory checkpoint protocol in docs/memory/sessions/README.md has been followed.',
        autoCheckpointHint,
        persistenceContract,
        '',
        '### Project Status',
        status.trim(),
        '',
        '### Active Session',
        active.trim(),
        '',
        '### Implementation Tracking',
        tracking.trim(),
      ].join('\n'),
    )
  },
})
