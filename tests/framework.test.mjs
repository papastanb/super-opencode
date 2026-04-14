import { beforeAll, describe, expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createHash } from 'node:crypto'
import { parse } from 'jsonc-parser'

import { installFramework, statusFramework, uninstallFramework, updateFramework } from '../src/framework/engine.ts'
import { patchOpencodeConfig } from '../src/framework/config.ts'
import { loadFrameworkManifest } from '../src/framework/manifest.ts'
import { diagnoseMcpPolicies } from '../src/framework/prerequisites.ts'

const execFileAsync = promisify(execFile)
const projectRoot = path.join(import.meta.dir, '..')
const cliEntry = path.join(projectRoot, 'scripts', 'install-project.mjs')

function hashContent(content) {
  return createHash('sha256').update(content).digest('hex')
}

async function readJson(filePath) {
  return parse(await readFile(filePath, 'utf8'))
}

async function runCli(cwd, args, env = process.env) {
  return execFileAsync('node', [cliEntry, ...args], {
    cwd,
    env: { ...process.env, ...env },
  })
}

async function createSandbox(label) {
  const root = await mkdtemp(path.join(tmpdir(), `super-opencode-${label}-`))
  const workspace = path.join(root, 'workspace')
  const globalConfigDir = path.join(root, 'global-config')
  await mkdir(workspace, { recursive: true })
  await mkdir(globalConfigDir, { recursive: true })
  return { root, workspace, globalConfigDir }
}

async function assertProjectInstallLayout(workspace) {
  expect(await readFile(path.join(workspace, '.opencode', 'agents', 'pm-agent.md'), 'utf8')).toContain('pm-agent')
  expect(await readFile(path.join(workspace, '.opencode', 'commands', 'sc-help.md'), 'utf8')).toContain('List available `/sc-*` commands')
  expect(await readFile(path.join(workspace, '.opencode', 'skills', 'sc-orchestration', 'SKILL.md'), 'utf8')).toContain('sc-orchestration')
  expect(await readFile(path.join(workspace, '.opencode', 'instructions', 'opencode-core.md'), 'utf8')).toContain('Super OpenCode Core Instructions')
}

async function assertGlobalInstallLayout(globalConfigDir) {
  expect(await readFile(path.join(globalConfigDir, 'agents', 'pm-agent.md'), 'utf8')).toContain('pm-agent')
  expect(await readFile(path.join(globalConfigDir, 'commands', 'sc-help.md'), 'utf8')).toContain('List available `/sc-*` commands')
  expect(await readFile(path.join(globalConfigDir, 'skills', 'sc-orchestration', 'SKILL.md'), 'utf8')).toContain('sc-orchestration')
  expect(await readFile(path.join(globalConfigDir, 'instructions', 'opencode-core.md'), 'utf8')).toContain('Super OpenCode Core Instructions')
}

beforeAll(async () => {
  await execFileAsync('bun', ['run', 'build'], { cwd: projectRoot, env: process.env, timeout: 60000 })
}, 120000)

describe('Package surface', () => {
  test('package exposes explicit server and tui targets', async () => {
    const pkg = await readJson(path.join(projectRoot, 'package.json'))
    expect(pkg.exports['./server'].import).toBe('./dist/src/server.js')
    expect(pkg.exports['./tui'].import).toBe('./dist/src/tui.js')
  })

  test('scopes command works without --scope', async () => {
    const sandbox = await createSandbox('scopes-command')

    try {
      const { stdout } = await runCli(sandbox.workspace, ['scopes'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      expect(stdout).toContain('"scope": "global"')
      expect(stdout).toContain('"scope": "project"')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })
})

describe('Framework bootstrap', () => {
  test('installs global scope into ~/.config/opencode-compatible layout', async () => {
    const sandbox = await createSandbox('global-only')

    try {
      const { stdout } = await runCli(sandbox.workspace, ['install', '--scope', 'global'], {
        OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
        CONTEXT7_API_KEY: '',
        TAVILY_API_KEY: '',
        MORPH_API_KEY: '',
      })

      expect(stdout).toContain('Scope: global')
      await assertGlobalInstallLayout(sandbox.globalConfigDir)

      const opencodeConfig = await readJson(path.join(sandbox.globalConfigDir, 'opencode.json'))
      const tuiConfig = await readJson(path.join(sandbox.globalConfigDir, 'tui.json'))
      expect(opencodeConfig.plugin).toContain('super-opencode-framework')
      expect(opencodeConfig.instructions).toContain('instructions/opencode-core.md')
      expect(tuiConfig.plugin).toContain('super-opencode-framework')
      expect(opencodeConfig.mcp.serena).toBeDefined()
      expect(opencodeConfig.mcp.context7.enabled).toBe(false)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('installs project scope into .opencode and project configs', async () => {
    const sandbox = await createSandbox('project-only')

    try {
      await writeFile(
        path.join(sandbox.workspace, 'opencode.json'),
        '{\n  // keep this comment\n  "instructions": ["docs/local.md"]\n}\n',
        'utf8',
      )

      const { stdout } = await runCli(sandbox.workspace, ['install', '--scope', 'project'], {
        OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
        CONTEXT7_API_KEY: '',
        TAVILY_API_KEY: '',
        MORPH_API_KEY: '',
      })

      expect(stdout).toContain('Scope: project')
      await assertProjectInstallLayout(sandbox.workspace)

      const opencodeConfig = await readJson(path.join(sandbox.workspace, 'opencode.json'))
      const tuiConfig = await readJson(path.join(sandbox.workspace, 'tui.json'))
      expect(await readFile(path.join(sandbox.workspace, 'opencode.json'), 'utf8')).toContain('// keep this comment')
      expect(opencodeConfig.plugin).toContain('super-opencode-framework')
      expect(opencodeConfig.instructions).toContain('.opencode/instructions/opencode-core.md')
      expect(tuiConfig.plugin).toContain('super-opencode-framework')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('supports global then project without mixing target directories', async () => {
    const sandbox = await createSandbox('global-then-project')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'global'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      await assertGlobalInstallLayout(sandbox.globalConfigDir)
      await assertProjectInstallLayout(sandbox.workspace)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('supports project then global without duplicating config entries', async () => {
    const sandbox = await createSandbox('project-then-global')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      await runCli(sandbox.workspace, ['install', '--scope', 'global'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      const projectConfig = await readJson(path.join(sandbox.workspace, 'opencode.json'))
      const globalConfig = await readJson(path.join(sandbox.globalConfigDir, 'opencode.json'))

      expect(projectConfig.plugin.filter((entry) => entry === 'super-opencode-framework')).toHaveLength(1)
      expect(globalConfig.plugin.filter((entry) => entry === 'super-opencode-framework')).toHaveLength(1)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('is idempotent on a second install', async () => {
    const sandbox = await createSandbox('idempotent')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      const secondRun = await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      expect(secondRun.stdout).toContain('already up to date')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('does not rewrite MCP config when only key order differs', async () => {
    const sandbox = await createSandbox('mcp-order-idempotent')

    try {
      const manifest = await loadFrameworkManifest()
      const diagnostics = await diagnoseMcpPolicies(manifest, {
        ...process.env,
        OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
        CONTEXT7_API_KEY: 'token',
      })

      await writeFile(
        path.join(sandbox.workspace, 'opencode.json'),
        `{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["super-opencode-framework"],
  "instructions": [".opencode/instructions/opencode-core.md"],
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "enabled": true,
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
`,
        'utf8',
      )

      const result = await patchOpencodeConfig({
        filePath: path.join(sandbox.workspace, 'opencode.json'),
        manifest,
        scope: 'project',
        diagnostics: diagnostics.filter((entry) => entry.name === 'context7'),
      })

      expect(result.changed).toBe(false)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('reports conflicts instead of overwriting a user-modified managed file', async () => {
    const sandbox = await createSandbox('conflict')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      const commandPath = path.join(sandbox.workspace, '.opencode', 'commands', 'sc-help.md')
      const userEditedContent = '# user override\n'
      await writeFile(commandPath, userEditedContent, 'utf8')

      let failure = null
      try {
        await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      } catch (error) {
        failure = error
      }

      expect(failure).not.toBeNull()
      expect(failure.stdout).toContain('conflict/manual action required')
      expect(await readFile(commandPath, 'utf8')).toBe(userEditedContent)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('updates a previously managed asset revision safely', async () => {
    const sandbox = await createSandbox('update')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      const commandPath = path.join(sandbox.workspace, '.opencode', 'commands', 'sc-help.md')
      const statePath = path.join(sandbox.workspace, '.opencode', 'super-opencode', 'install-state.json')
      const syntheticOldContent = '# old managed revision\n'
      await writeFile(commandPath, syntheticOldContent, 'utf8')

      const state = await readJson(statePath)
      state.files['.opencode/commands/sc-help.md'].installedHash = hashContent(syntheticOldContent)
      await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')

      const report = await updateFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
      })

      expect(report.items.some((item) => item.name === '.opencode/commands/sc-help.md' && item.status === 'updated')).toBe(true)
      expect(await readFile(commandPath, 'utf8')).toContain('List available `/sc-*` commands')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('preserves install state and config when uninstall hits a conflicted managed file', async () => {
    const sandbox = await createSandbox('uninstall-conflict')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      const commandPath = path.join(sandbox.workspace, '.opencode', 'commands', 'sc-help.md')
      const statePath = path.join(sandbox.workspace, '.opencode', 'super-opencode', 'install-state.json')
      await writeFile(commandPath, '# user modified uninstall conflict\n', 'utf8')

      const report = await uninstallFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
      })

      expect(report.items.some((item) => item.status === 'conflict/manual action required')).toBe(true)
      expect(await readFile(commandPath, 'utf8')).toBe('# user modified uninstall conflict\n')

      const state = await readJson(statePath)
      expect(state.files['.opencode/commands/sc-help.md']).toBeDefined()

      const opencodeConfig = await readJson(path.join(sandbox.workspace, 'opencode.json'))
      const tuiConfig = await readJson(path.join(sandbox.workspace, 'tui.json'))
      expect(opencodeConfig.plugin).toContain('super-opencode-framework')
      expect(tuiConfig.plugin).toContain('super-opencode-framework')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('preserves a user-modified framework-added MCP entry during uninstall', async () => {
    const sandbox = await createSandbox('uninstall-mcp-conflict')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], {
        OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
        CONTEXT7_API_KEY: '',
        TAVILY_API_KEY: '',
        MORPH_API_KEY: '',
      })

      const opencodePath = path.join(sandbox.workspace, 'opencode.json')
      const statePath = path.join(sandbox.workspace, '.opencode', 'super-opencode', 'install-state.json')
      const config = await readJson(opencodePath)
      config.mcp.context7.url = 'https://example.invalid/custom-context7'
      await writeFile(opencodePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8')

      const report = await uninstallFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: {
          ...process.env,
          OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
          CONTEXT7_API_KEY: '',
          TAVILY_API_KEY: '',
          MORPH_API_KEY: '',
        },
      })

      const preservedConfig = await readJson(opencodePath)
      expect(preservedConfig.mcp.context7.url).toBe('https://example.invalid/custom-context7')
      expect(report.items.some((item) => item.kind === 'mcp' && item.name === 'context7' && item.status === 'conflict/manual action required')).toBe(true)

      const state = await readJson(statePath)
      expect(state.ownership.addedMcpKeys).toContain('context7')
      expect(typeof state.ownership.addedMcpHashes.context7).toBe('string')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('does not delete pre-existing identical files during uninstall', async () => {
    const sandbox = await createSandbox('uninstall-adopted-files')

    try {
      // Create a pre-existing file with content that matches the framework asset
      const commandPath = path.join(sandbox.workspace, '.opencode', 'commands', 'sc-agent.md')
      const commandContent = await readFile(path.join(import.meta.dir, '..', '.opencode', 'commands', 'sc-agent.md'), 'utf8')
      await mkdir(path.dirname(commandPath), { recursive: true })
      await writeFile(commandPath, commandContent, 'utf8')

      // Install the framework (should adopt the existing file)
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      // Verify the file is still there
      expect(await readFile(commandPath, 'utf8')).toBe(commandContent)

      // Check the install state to see if the file was recorded
      const statePath = path.join(sandbox.workspace, '.opencode', 'super-opencode', 'install-state.json')
      const state = await readJson(statePath)
      
      // Verify that the file is in the state with origin "adopted"
      expect(state.files['.opencode/commands/sc-agent.md']).toBeDefined()
      expect(state.files['.opencode/commands/sc-agent.md'].origin).toBe('adopted')

      // Uninstall the framework
      const report = await uninstallFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
      })

      // Verify the file is still there after uninstall
      expect(await readFile(commandPath, 'utf8')).toBe(commandContent)
      
      // Verify the report indicates the file was skipped
      const skippedItem = report.items.find(item => 
        item.name === '.opencode/commands/sc-agent.md' && 
        item.status === 'skipped'
      )
      expect(skippedItem).toBeDefined()
      expect(skippedItem?.detail).toContain('unmanaged')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('uninstalls project scope cleanly', async () => {
    const sandbox = await createSandbox('uninstall-project')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      const { stdout } = await runCli(sandbox.workspace, ['uninstall', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      expect(stdout).toContain('Action: uninstall')

      await expect(readFile(path.join(sandbox.workspace, 'opencode.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(readFile(path.join(sandbox.workspace, 'tui.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('uninstall cleans config and state even when adopted files are preserved', async () => {
    const sandbox = await createSandbox('uninstall-adopted-cleanup')

    try {
      const commandPath = path.join(sandbox.workspace, '.opencode', 'commands', 'sc-agent.md')
      const commandContent = await readFile(path.join(import.meta.dir, '..', '.opencode', 'commands', 'sc-agent.md'), 'utf8')
      await mkdir(path.dirname(commandPath), { recursive: true })
      await writeFile(commandPath, commandContent, 'utf8')

      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })
      const report = await uninstallFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
      })

      expect(await readFile(commandPath, 'utf8')).toBe(commandContent)
      await expect(readFile(path.join(sandbox.workspace, 'opencode.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(readFile(path.join(sandbox.workspace, 'tui.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(readFile(path.join(sandbox.workspace, '.opencode', 'super-opencode', 'install-state.json'), 'utf8')).rejects.toMatchObject({ code: 'ENOENT' })
      expect(report.items.some((item) => item.name === '.opencode/commands/sc-agent.md' && item.status === 'skipped')).toBe(true)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('fails install without rewriting an invalid opencode.json', async () => {
    const sandbox = await createSandbox('invalid-opencode-install')

    try {
      const opencodePath = path.join(sandbox.workspace, 'opencode.json')
      const invalidJsonc = '{\n  "instructions": ["docs/local.md"\n}\n'
      await writeFile(opencodePath, invalidJsonc, 'utf8')

      await expect(
        installFramework({
          scope: 'project',
          projectRoot: sandbox.workspace,
          env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
        }),
      ).rejects.toThrow(/Invalid JSONC/)

      expect(await readFile(opencodePath, 'utf8')).toBe(invalidJsonc)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('fails install without rewriting an invalid tui.json', async () => {
    const sandbox = await createSandbox('invalid-tui-install')

    try {
      const tuiPath = path.join(sandbox.workspace, 'tui.json')
      const invalidJsonc = '{\n  "plugin": ["super-opencode-framework",\n}\n'
      await writeFile(tuiPath, invalidJsonc, 'utf8')

      await expect(
        installFramework({
          scope: 'project',
          projectRoot: sandbox.workspace,
          env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
        }),
      ).rejects.toThrow(/Invalid JSONC/)

      expect(await readFile(tuiPath, 'utf8')).toBe(invalidJsonc)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('update refreshes stale schema values in config files', async () => {
    const sandbox = await createSandbox('schema-refresh')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      const opencodePath = path.join(sandbox.workspace, 'opencode.json')
      const tuiPath = path.join(sandbox.workspace, 'tui.json')
      const opencodeConfig = await readJson(opencodePath)
      const tuiConfig = await readJson(tuiPath)
      opencodeConfig.$schema = 'https://example.invalid/old-opencode-schema.json'
      tuiConfig.$schema = 'https://example.invalid/old-tui-schema.json'
      await writeFile(opencodePath, `${JSON.stringify(opencodeConfig, null, 2)}\n`, 'utf8')
      await writeFile(tuiPath, `${JSON.stringify(tuiConfig, null, 2)}\n`, 'utf8')

      const report = await updateFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
      })

      const refreshedOpencode = await readJson(opencodePath)
      const refreshedTui = await readJson(tuiPath)
      expect(refreshedOpencode.$schema).not.toBe('https://example.invalid/old-opencode-schema.json')
      expect(refreshedTui.$schema).not.toBe('https://example.invalid/old-tui-schema.json')
      expect(report.items.some((item) => item.name === 'opencode.json' && item.status === 'updated')).toBe(true)
      expect(report.items.some((item) => item.name === 'tui.json' && item.status === 'updated')).toBe(true)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })
})

describe('MCP diagnostics', () => {
  test('marks env-backed MCPs disabled when secrets are absent', async () => {
    const sandbox = await createSandbox('mcp-missing-env')

    try {
      const report = await installFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: {
          ...process.env,
          OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
          CONTEXT7_API_KEY: '',
          TAVILY_API_KEY: '',
          MORPH_API_KEY: '',
        },
      })

      expect(report.mcp.find((entry) => entry.name === 'context7')?.status).toBe('configured but disabled by missing env')
      expect(report.mcp.find((entry) => entry.name === 'tavily')?.status).toBe('configured but disabled by missing env')
      expect(report.mcp.find((entry) => entry.name === 'morph')?.status).toBe('configured but disabled by missing env')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('re-enables env-backed MCPs on update once prerequisites appear', async () => {
    const sandbox = await createSandbox('mcp-reenable')

    try {
      await installFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: {
          ...process.env,
          OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
          CONTEXT7_API_KEY: '',
          TAVILY_API_KEY: '',
          MORPH_API_KEY: '',
        },
      })

      const firstConfig = await readJson(path.join(sandbox.workspace, 'opencode.json'))
      expect(firstConfig.mcp.context7.enabled).toBe(false)

      const report = await updateFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: {
          ...process.env,
          OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
          CONTEXT7_API_KEY: 'token',
          TAVILY_API_KEY: 'token',
          MORPH_API_KEY: 'token',
        },
      })

      expect(report.mcp.find((entry) => entry.name === 'context7')?.status).toBe('configured and enabled')

      const updatedConfig = await readJson(path.join(sandbox.workspace, 'opencode.json'))
      expect(updatedConfig.mcp.context7.enabled).toBe(true)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('marks binary-backed MCPs disabled when binaries are unavailable', async () => {
    const sandbox = await createSandbox('mcp-missing-bin')

    try {
      const report = await statusFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: {
          PATH: '',
          PATHEXT: process.env.PATHEXT ?? '.EXE;.CMD;.BAT;.COM',
          OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
          CONTEXT7_API_KEY: 'token',
          TAVILY_API_KEY: 'token',
          MORPH_API_KEY: 'token',
        },
      })

      expect(report.mcp.find((entry) => entry.name === 'serena')?.status).toBe('configured but disabled by missing binary')
      expect(report.mcp.find((entry) => entry.name === 'sequential')?.status).toBe('configured but disabled by missing binary')
      expect(report.mcp.find((entry) => entry.name === 'playwright')?.status).toBe('configured but disabled by missing binary')
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('status reports missing assets truthfully in a clean workspace', async () => {
    const sandbox = await createSandbox('status-clean-workspace')

    try {
      const report = await statusFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: {
          ...process.env,
          OPENCODE_CONFIG_DIR: sandbox.globalConfigDir,
        },
      })

      const missingAssetItems = report.items.filter(
        (item) => item.kind === 'asset' && item.detail === 'Asset is not installed in this scope.',
      )

      expect(missingAssetItems.length).toBeGreaterThan(0)
      expect(missingAssetItems.every((item) => item.status === 'skipped')).toBe(true)
      expect(report.items.some((item) => item.status === 'installed')).toBe(false)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })

  test('status reports outdated managed assets without claiming they were updated', async () => {
    const sandbox = await createSandbox('status-outdated')

    try {
      await runCli(sandbox.workspace, ['install', '--scope', 'project'], { OPENCODE_CONFIG_DIR: sandbox.globalConfigDir })

      const commandPath = path.join(sandbox.workspace, '.opencode', 'commands', 'sc-help.md')
      const statePath = path.join(sandbox.workspace, '.opencode', 'super-opencode', 'install-state.json')
      const previousManagedContent = '# old managed revision\n'
      await writeFile(commandPath, previousManagedContent, 'utf8')

      const state = await readJson(statePath)
      state.files['.opencode/commands/sc-help.md'].installedHash = hashContent(previousManagedContent)
      await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`, 'utf8')

      const report = await statusFramework({
        scope: 'project',
        projectRoot: sandbox.workspace,
        env: { ...process.env, OPENCODE_CONFIG_DIR: sandbox.globalConfigDir },
      })

      const assetItem = report.items.find((item) => item.name === '.opencode/commands/sc-help.md')
      expect(assetItem?.status).toBe('skipped')
      expect(assetItem?.detail).toBe('Asset is outdated and would update on install/update.')
      expect(report.restartRequired).toBe(false)
    } finally {
      await rm(sandbox.root, { recursive: true, force: true })
    }
  })
})
