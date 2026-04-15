import type { PluginModule } from "@opencode-ai/plugin"

import { SuperOpenCodePlugin } from "./runtime/plugin.js"

const pluginModule: PluginModule & { id: string } = {
  id: "super-opencode-framework",
  server: SuperOpenCodePlugin,
}

export { SuperOpenCodePlugin }
export default pluginModule
