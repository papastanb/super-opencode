import { persistenceContract, autoCheckpointHint } from './memory.js'

export const createCompactionHooks = (worktree: string) => ({
  'experimental.session.compacting': async (_input: unknown, output: { context: string[] }) => {
    output.context.push(
      [
        '## Super OpenCode Memory',
        `Worktree: ${worktree}`,
        autoCheckpointHint,
        persistenceContract,
      ].join('\n'),
    )
  },
})
