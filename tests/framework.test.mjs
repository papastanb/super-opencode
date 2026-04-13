import { describe, test, expect } from 'bun:test'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const projectRoot = join(import.meta.dir, '..')

describe('Project Structure', () => {
  test('package.json exists and is valid', () => {
    const pkgPath = join(projectRoot, 'package.json')
    expect(existsSync(pkgPath)).toBe(true)
    
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    expect(pkg.name).toBe('super-opencode-framework')
    expect(pkg.version).toBe('1.0.1')
  })

  test('opencode.json exists and is valid', () => {
    const configPath = join(projectRoot, 'opencode.json')
    expect(existsSync(configPath)).toBe(true)
    
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    expect(config.mcp?.serena?.enabled).toBe(true)
  })

  test('AGENTS.md exists', () => {
    expect(existsSync(join(projectRoot, 'AGENTS.md'))).toBe(true)
  })

  test('runtime instructions exist', () => {
    expect(existsSync(join(projectRoot, '.opencode/instructions/opencode-core.md'))).toBe(true)
  })
})

describe('OpenCode Commands', () => {
  test('commands directory exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/commands'))).toBe(true)
  })

  test('sc-pm command exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/commands/sc-pm.md'))).toBe(true)
  })

  test('sc-save command exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/commands/sc-save.md'))).toBe(true)
  })

  test('sc-load command exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/commands/sc-load.md'))).toBe(true)
  })
})

describe('OpenCode Agents', () => {
  test('agents directory exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/agents'))).toBe(true)
  })

  test('pm-agent exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/agents/pm-agent.md'))).toBe(true)
  })
})

describe('OpenCode Skills', () => {
  test('skills directory exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/skills'))).toBe(true)
  })

  test('sc-brainstorming skill exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/skills/sc-brainstorming/SKILL.md'))).toBe(true)
  })

  test('sc-orchestration skill exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/skills/sc-orchestration/SKILL.md'))).toBe(true)
  })
})

describe('Plugin', () => {
  test('plugin main file exists', () => {
    expect(existsSync(join(projectRoot, '.opencode/plugins/super-opencode.ts'))).toBe(true)
  })

  test('plugin modules exist', () => {
    expect(existsSync(join(projectRoot, '.opencode/plugins/super-opencode/memory.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, '.opencode/plugins/super-opencode/system.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, '.opencode/plugins/super-opencode/commands.ts'))).toBe(true)
  })
})
