#!/usr/bin/env bun
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

async function checkStructure() {
  const checks = []
  const root = process.cwd()
  
  checks.push({
    name: 'package.json exists',
    status: existsSync(path.join(root, 'package.json')) ? 'pass' : 'fail'
  })
  
  checks.push({
    name: 'opencode.json exists',
    status: existsSync(path.join(root, 'opencode.json')) ? 'pass' : 'fail'
  })
  
  checks.push({
    name: '.opencode/commands/ exists',
    status: existsSync(path.join(root, '.opencode/commands')) ? 'pass' : 'fail'
  })
  
  checks.push({
    name: '.opencode/agents/ exists',
    status: existsSync(path.join(root, '.opencode/agents')) ? 'pass' : 'fail'
  })
  
  checks.push({
    name: '.opencode/skills/ exists',
    status: existsSync(path.join(root, '.opencode/skills')) ? 'pass' : 'fail'
  })
  
  checks.push({
    name: '.opencode/plugins/ exists',
    status: existsSync(path.join(root, '.opencode/plugins')) ? 'pass' : 'fail'
  })
  
  try {
    const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf-8'))
    checks.push({
      name: 'package.json valid',
      status: pkg.name && pkg.version ? 'pass' : 'fail'
    })
  } catch {
    checks.push({ name: 'package.json valid', status: 'fail' })
  }
  
  try {
    const config = JSON.parse(await readFile(path.join(root, 'opencode.json'), 'utf-8'))
    const hasSerena = config.mcp?.serena?.enabled
    checks.push({
      name: 'Serena MCP enabled',
      status: hasSerena ? 'pass' : 'warn'
    })
  } catch {
    checks.push({ name: 'opencode.json valid', status: 'fail' })
  }
  
  return {
    platform: process.platform,
    checks
  }
}

async function main() {
  console.log('🔍 Cross-Platform Validation\n')
  
  const result = await checkStructure()
  
  console.log(`Platform: ${result.platform}`)
  console.log('')
  
  let passCount = 0
  let failCount = 0
  let warnCount = 0
  
  for (const check of result.checks) {
    const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️'
    console.log(`${icon} ${check.name}`)
    
    if (check.status === 'pass') passCount++
    else if (check.status === 'fail') failCount++
    else warnCount++
  }
  
  console.log('')
  console.log(`Results: ${passCount} passed, ${failCount} failed, ${warnCount} warnings`)
  
  if (failCount > 0) {
    process.exit(1)
  }
}

main().catch(console.error)