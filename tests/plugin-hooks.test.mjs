import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { createCommandHooks, createCompactionHooks, createSystemHooks } from '../src/runtime/hooks.ts'
import { commandPersistenceHint, persistenceContract } from '../src/runtime/memory.ts'
import { SuperOpenCodePlugin } from '../src/runtime/plugin.ts'

const runtimeLoadMarker = '__super_opencode_runtime_loaded__'

beforeEach(() => {
  delete globalThis[runtimeLoadMarker]
})

afterEach(() => {
  delete globalThis[runtimeLoadMarker]
})

describe('Super OpenCode runtime hooks', () => {
  test('system hook injects the persistence contract only once', async () => {
    const hooks = createSystemHooks()
    const output = { system: [] }

    await hooks['experimental.chat.system.transform']({}, output)
    await hooks['experimental.chat.system.transform']({}, output)

    expect(output.system).toEqual([persistenceContract])
  })

  test('command hook deduplicates the persistence hint', async () => {
    const hooks = createCommandHooks()
    const output = { parts: [] }

    await hooks['command.execute.before']({ command: '/sc-save', sessionID: 'session-1' }, output)
    await hooks['command.execute.before']({ command: '/sc-save', sessionID: 'session-1' }, output)

    expect(output.parts).toHaveLength(1)
    expect(output.parts[0].text).toBe(commandPersistenceHint)
  })

  test('compaction hook deduplicates persistence guidance', async () => {
    const worktree = mkdtempSync(path.join(tmpdir(), 'super-opencode-'))
    const hooks = createCompactionHooks(worktree)
    const output = { context: [] }

    await hooks['experimental.session.compacting']({}, output)
    await hooks['experimental.session.compacting']({}, output)

    expect(output.context).toHaveLength(1)
    expect(output.context[0]).toContain('## Super OpenCode Memory')
    expect(output.context[0]).toContain('Serena is the persistence source of truth')
  })

  test('runtime plugin only registers hooks once per process', async () => {
    const logs = []
    const client = {
      app: {
        log: async (entry) => {
          logs.push(entry.body.message)
        },
      },
    }

    const first = await SuperOpenCodePlugin({ client, worktree: 'D:/repo' })
    const second = await SuperOpenCodePlugin({ client, worktree: 'D:/repo' })

    expect(typeof first['experimental.chat.system.transform']).toBe('function')
    expect(second).toEqual({})
    expect(logs).toEqual([
      'Super OpenCode plugin initialized',
      'Super OpenCode runtime already active, skipping duplicate hook registration',
    ])
  })
})
