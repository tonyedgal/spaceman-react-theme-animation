import assert from 'node:assert/strict'

import * as core from '../dist/core/index.js'
import * as react from '../dist/react/index.js'
import * as tanstack from '../dist/tanstack/index.js'

assert.equal(tanstack.buildServerThemeData('dark', 'ocean').theme, 'dark')

assert.equal(react.ThemeProvider, react.NextThemeProvider)

assert.equal(core.ThemeAnimationType.CIRCLE, 'circle')

let updates = 0

await core.runThemeTransition(() => {
  updates++
}, null)

assert.equal(updates, 1)

assert.equal(core.getSlideFromCoords('top-right').a, 100)

assert.equal(core.ThemeAnimationType.SVG_LOGO, 'svg-logo')

console.log('Subpath import smoke test passed')
