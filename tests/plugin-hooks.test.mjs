import { describe, expect, test } from 'bun:test'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createCommandHooks } from '../.opencode/plugins/super-opencode/commands.ts'
import { createCompactionHooks } from '../.opencode/plugins/super-opencode/compaction.ts'
import { commandPersistenceHint, persistenceContract } from '../.opencode/plugins/super-opencode/memory.ts'
import { createSystemHooks } from '../.opencode/plugins/super-opencode/system.ts'

describe('Super OpenCode plugin hooks', () => {
  test('system hook injects the persistence contract', async () => {
    const hooks = createSystemHooks()
    const output = { system: [] }

    await hooks['experimental.chat.system.transform']({}, output)

    expect(output.system).toContain(persistenceContract)
  })

  test('command hook adds only the persistence hint for sc-save', async () => {
    const hooks = createCommandHooks()
    const output = { parts: [] }

    await hooks['command.execute.before']({ command: '/sc-save', sessionID: 'session-1' }, output)

    expect(output.parts).toHaveLength(1)
    expect(output.parts[0].text).toBe(commandPersistenceHint)
  })

  test('command hook stays silent for unrelated commands', async () => {
    const hooks = createCommandHooks()
    const output = { parts: [] }

    await hooks['command.execute.before']({ command: '/sc-implement', sessionID: 'session-2' }, output)

    expect(output.parts).toHaveLength(0)
  })

  test('compaction hook injects persistence guidance', async () => {
    const worktree = mkdtempSync(path.join(tmpdir(), 'super-opencode-'))

    const hooks = createCompactionHooks(worktree)
    const output = { context: [] }

    await hooks['experimental.session.compacting']({}, output)

    expect(output.context).toHaveLength(1)
    expect(output.context[0]).toContain('## Super OpenCode Memory')
    expect(output.context[0]).toContain('Serena is the persistence source of truth')
  })
})
