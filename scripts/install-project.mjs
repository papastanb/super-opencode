#!/usr/bin/env bun
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const OPENCODE_CONFIG_DIR = '.opencode'
const OPENCODE_JSON = 'opencode.json'

async function ensureDir(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true })
  }
}

async function installProject() {
  console.log('🚀 Installing Super OpenCode...')
  
  const projectRoot = process.cwd()
  
  if (!existsSync(path.join(projectRoot, '.opencode'))) {
    console.log('❌ No .opencode directory found. Run from project root.')
    process.exit(1)
  }
  
  console.log('✅ Project structure validated')
  
  const opencodeConfigPath = path.join(projectRoot, OPENCODE_JSON)
  if (existsSync(opencodeConfigPath)) {
    const config = JSON.parse(await readFile(opencodeConfigPath, 'utf-8'))
    if (!config.mcp?.serena?.enabled) {
      console.log('⚠️  Serena MCP not enabled in opencode.json')
      console.log('   Recommended: Enable Serena for full persistence support')
    } else {
      console.log('✅ Serena MCP enabled')
    }
  }
  
  console.log('✅ Installation complete!')
  console.log('')
  console.log('Next steps:')
  console.log('  - Run: opencode')
  console.log('  - Use: /sc-help for available commands')
  console.log('  - Use: /sc-pm for project context')
}

installProject().catch(console.error)