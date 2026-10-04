import assert from 'node:assert/strict'

import * as core from '../dist/core/index.js'
import * as react from '../dist/react/index.js'
import * as tanstack from '../dist/tanstack/index.js'

assert.equal(tanstack.buildServerThemeData('dark', 'ocean').theme, 'dark')

assert.equal(react.ThemeProvider, react.NextThemeProvider)

assert.equal(core.ThemeAnimationType.CIRCLE, 'circle')

console.log('Subpath import smoke test passed')
