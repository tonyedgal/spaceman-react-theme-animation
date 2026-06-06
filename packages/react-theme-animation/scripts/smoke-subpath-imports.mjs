import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(process.cwd(), 'dist')

const tanstack = await import(
  pathToFileURL(resolve(root, 'tanstack/index.js')).href
)
const react = await import(pathToFileURL(resolve(root, 'react/index.js')).href)
const core = await import(pathToFileURL(resolve(root, 'core/index.js')).href)

if (typeof tanstack.buildServerThemeData !== 'function') {
  throw new Error('Missing tanstack subpath export: buildServerThemeData')
}

if (typeof react.ThemeProvider !== 'function') {
  throw new Error('Missing react subpath export: ThemeProvider')
}

if (!('ThemeAnimationType' in core)) {
  throw new Error('Missing core subpath export: ThemeAnimationType')
}

console.log('Subpath import smoke test passed')
