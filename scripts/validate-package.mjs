#!/usr/bin/env node

import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { execSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const distServerEntry = path.join(root, 'dist', 'src', 'server.js')
const distTuiEntry = path.join(root, 'dist', 'src', 'tui.js')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

if (!existsSync(distServerEntry)) {
  console.error(`Missing built server entry: ${distServerEntry}`)
  process.exit(1)
}

if (!existsSync(distTuiEntry)) {
  console.error(`Missing built TUI entry: ${distTuiEntry}`)
  process.exit(1)
}

const serverModule = await import(pathToFileURL(distServerEntry).href)
const tuiModule = await import(pathToFileURL(distTuiEntry).href)

if (typeof serverModule.SuperOpenCodePlugin !== 'function') {
  console.error('Built server entry does not export SuperOpenCodePlugin')
  process.exit(1)
}

if (typeof serverModule.default?.server !== 'function') {
  console.error('Built server entry does not expose a default server plugin module')
  process.exit(1)
}

if (typeof tuiModule.default?.tui !== 'function') {
  console.error('Built TUI entry does not expose a default TUI plugin module')
  process.exit(1)
}

const rawPackOutput = execSync(`${npmCommand} pack --dry-run --json --loglevel=error`, {
  cwd: root,
  encoding: 'utf8',
  shell: true,
})

const packSummary = JSON.parse(rawPackOutput)
const packedFiles = Array.isArray(packSummary) ? packSummary[0]?.files ?? [] : []
const packedPaths = packedFiles.map((entry) => entry.path)
const forbiddenPrefixes = ['docs/', '.opencode/package-lock.json', '.opencode/package.json']
const forbiddenPaths = ['.opencode/README.md', 'pr-body.md', 'pr-body-v2.md']

for (const prefix of forbiddenPrefixes) {
  const offendingPath = packedPaths.find((candidate) => candidate.startsWith(prefix))
  if (offendingPath) {
    console.error(`Forbidden file detected in package: ${offendingPath}`)
    process.exit(1)
  }
}

for (const forbiddenPath of forbiddenPaths) {
  if (packedPaths.includes(forbiddenPath)) {
    console.error(`Forbidden file detected in package: ${forbiddenPath}`)
    process.exit(1)
  }
}

if (!packedPaths.includes('dist/src/server.js')) {
  console.error('Built server entry is missing from npm pack output')
  process.exit(1)
}

if (!packedPaths.includes('dist/src/tui.js')) {
  console.error('Built TUI entry is missing from npm pack output')
  process.exit(1)
}

console.log('Package validation passed.')
