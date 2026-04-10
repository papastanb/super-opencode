import { persistenceContract } from './memory.js'

export const createSystemHooks = () => ({
  'experimental.chat.system.transform': async (_input: unknown, output: { system: string[] }) => {
    output.system.push(persistenceContract)
  },
})
