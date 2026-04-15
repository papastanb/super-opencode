#!/usr/bin/env node

import path from "node:path"
import process from "node:process"
import { fileURLToPath, pathToFileURL } from "node:url"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const cliEntry = path.join(scriptDir, "..", "dist", "src", "cli.js")

try {
  const cliModule = await import(pathToFileURL(cliEntry).href)
  const exitCode = await cliModule.runCli(process.argv.slice(2))
  process.exitCode = exitCode
} catch (error) {
  const message = error instanceof Error ? error.stack ?? error.message : String(error)
  process.stderr.write(`${message}\n`)
  process.exitCode = 1
}
