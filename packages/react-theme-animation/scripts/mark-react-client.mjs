import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const directive = "'use client';\n"

async function markClientEntry(relativePath) {
  const filePath = resolve(process.cwd(), relativePath)
  const source = await readFile(filePath, 'utf8')

  if (source.startsWith(directive)) {
    return
  }

  await writeFile(filePath, `${directive}${source}`)
}

await Promise.all([
  markClientEntry('dist/react/index.js'),
  markClientEntry('dist/react/index.cjs'),
])
