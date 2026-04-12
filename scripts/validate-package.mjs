#!/usr/bin/env node

import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const distEntry = path.join(root, 'dist', '.opencode', 'plugins', 'super-opencode.js')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

if (!existsSync(distEntry)) {
  console.error(`Missing built plugin entry: ${distEntry}`)
  process.exit(1)
}

const pluginModule = await import(pathToFileURL(distEntry).href)
if (typeof pluginModule.SuperOpenCodePlugin !== 'function') {
  console.error('Built plugin entry does not export SuperOpenCodePlugin')
  process.exit(1)
}

const rawPackOutput = execSync(`${npmCommand} pack --dry-run --json`, {
  cwd: root,
  encoding: 'utf8',
  shell: true,
})

const packSummary = JSON.parse(rawPackOutput)
const packedFiles = Array.isArray(packSummary) ? packSummary[0]?.files ?? [] : []
const packedPaths = packedFiles.map((entry) => entry.path)
const forbiddenPrefixes = ['docs/memory/', '.opencode/package-lock.json', '.opencode/package.json']

for (const prefix of forbiddenPrefixes) {
  const offendingPath = packedPaths.find((candidate) => candidate.startsWith(prefix))
  if (offendingPath) {
    console.error(`Forbidden file detected in package: ${offendingPath}`)
    process.exit(1)
  }
}

if (!packedPaths.includes('dist/.opencode/plugins/super-opencode.js')) {
  console.error('Built plugin entry is missing from npm pack output')
  process.exit(1)
}

console.log('Package validation passed.')
