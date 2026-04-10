import { commandPersistenceHint } from './memory.js'

const persistenceCommands = new Set(['sc-pm', 'sc-save', 'sc-load', 'sc-reflect'])
const checkpointCommands = new Set(['sc-save', 'sc-spawn', 'sc-workflow'])

export const createCommandHooks = () => ({
  'command.execute.before': async (input: { command: string; sessionID: string }, output: { parts: unknown[] }) => {
    const normalized = input.command.replace(/^\//, '')
    
    if (persistenceCommands.has(normalized)) {
      output.parts.push({
        id: 'super-opencode-persistence-hint',
        sessionID: input.sessionID,
        messageID: '',
        type: 'text',
        text: commandPersistenceHint,
      })
    }

    if (checkpointCommands.has(normalized)) {
      output.parts.push({
        id: 'super-opencode-checkpoint-hint',
        sessionID: input.sessionID,
        messageID: '',
        type: 'text',
        text: 'Consider using `/sc-save` to create a checkpoint before proceeding with long operations.',
      })
    }
  },
})
