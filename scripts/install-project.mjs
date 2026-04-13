#!/usr/bin/env node

import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const installEntries = [
  ['.opencode/commands', '.opencode/commands'],
  ['.opencode/agents', '.opencode/agents'],
  ['.opencode/skills', '.opencode/skills'],
  ['.opencode/plugins', '.opencode/plugins'],
  ['.opencode/instructions', '.opencode/instructions'],
]

function parseArgs(argv) {
  const args = argv.slice(2)
  const command = args[0] && !args[0].startsWith('--') ? args[0] : 'install'
  const force = args.includes('--force')
  const targetFlagIndex = args.findIndex((arg) => arg === '--target')
  const target = targetFlagIndex >= 0 ? args[targetFlagIndex + 1] : process.cwd()

  return { command, force, target: path.resolve(target ?? process.cwd()) }
}

async function copyRuntimeAssets(targetRoot, force) {
  for (const [source, destination] of installEntries) {
    const sourcePath = path.join(packageRoot, source)
    const destinationPath = path.join(targetRoot, destination)

    await mkdir(path.dirname(destinationPath), { recursive: true })
    await cp(sourcePath, destinationPath, {
      recursive: true,
      force,
      filter: (entry) => !entry.endsWith('.gitkeep'),
    })
  }
}

async function ensureProjectInstructions(targetRoot) {
  const opencodeConfigPath = path.join(targetRoot, 'opencode.json')
  if (!existsSync(opencodeConfigPath)) {
    return false
  }

  const config = JSON.parse(await readFile(opencodeConfigPath, 'utf8'))
  const instructions = Array.isArray(config.instructions) ? config.instructions : []
  const requiredInstruction = '.opencode/instructions/opencode-core.md'

  if (!instructions.includes(requiredInstruction)) {
    instructions.push(requiredInstruction)
    config.instructions = instructions
    await writeFile(opencodeConfigPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')
  }

  return true
}

async function installProject(targetRoot, force) {
  console.log('Syncing bundled Super OpenCode assets...')
  console.log(`Target: ${targetRoot}`)

  await copyRuntimeAssets(targetRoot, force)
  const updatedConfig = await ensureProjectInstructions(targetRoot)

  console.log('')
  console.log('Installed:')
  console.log('- .opencode/commands')
  console.log('- .opencode/agents')
  console.log('- .opencode/skills')
  console.log('- .opencode/plugins')
  console.log('- .opencode/instructions/opencode-core.md')
  console.log('')

  if (updatedConfig) {
    console.log('Updated opencode.json instructions with .opencode/instructions/opencode-core.md')
  } else {
    console.log('No opencode.json found. Add .opencode/instructions/opencode-core.md to your project instructions manually.')
  }

  console.log('')
  console.log('Next steps:')
  console.log('- Ensure Node.js 24 and Bun are installed')
  console.log('- Review opencode.json and enable the MCPs you want to use')
  console.log('- Start OpenCode in the target project')
}

const { command, force, target } = parseArgs(process.argv)

if (command !== 'install') {
  console.error(`Unknown command: ${command}`)
  console.error('Usage: super-opencode-framework install [--target <path>] [--force]')
  process.exit(1)
}

installProject(target, force).catch((error) => {
  console.error(error)
  process.exit(1)
})
