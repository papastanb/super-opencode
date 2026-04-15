import { parse, printParseErrorCode, type ParseError } from "jsonc-parser"

export type JsonObject = Record<string, unknown>

export function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function getLineAndColumn(text: string, offset: number): { line: number; column: number } {
  let line = 1
  let column = 1

  for (let index = 0; index < offset; index += 1) {
    if (text[index] === "\n") {
      line += 1
      column = 1
      continue
    }

    column += 1
  }

  return { line, column }
}

/** Formats a JSONC parser error into a user-facing validation message. */
export function formatJsoncParseError(filePath: string, raw: string, error: ParseError): Error {
  const { line, column } = getLineAndColumn(raw, error.offset)
  return new Error(`Invalid JSONC in ${filePath} at ${line}:${column}: ${printParseErrorCode(error.error)}.`)
}

/** Parses a JSONC object and fails fast when the file cannot be safely mutated. */
export function parseJsoncObject(raw: string, filePath: string): JsonObject {
  const errors: ParseError[] = []
  const parsed = parse(raw, errors)
  if (errors.length > 0) {
    throw formatJsoncParseError(filePath, raw, errors[0])
  }

  if (!isObject(parsed)) {
    throw new Error(`Invalid JSONC in ${filePath}: root value must be an object.`)
  }

  return parsed
}

export function hasPluginSpec(entries: unknown[], spec: string): boolean {
  return entries.some((entry) => {
    const value = typeof entry === "string" ? entry : Array.isArray(entry) && typeof entry[0] === "string" ? entry[0] : undefined
    return value === spec || value?.startsWith(`${spec}@`) === true
  })
}
