import assert from 'node:assert/strict'

import * as root from '@space-man/react-theme-animation'
import * as core from '@space-man/react-theme-animation/core'
import * as react from '@space-man/react-theme-animation/react'
import * as tanstack from '@space-man/react-theme-animation/tanstack'

assert.equal(tanstack.buildServerThemeData('dark', 'ocean').theme, 'dark')

assert.equal(react.ThemeProvider, react.NextThemeProvider)

assert.equal(root.ThemeProvider, react.ThemeProvider)

assert.equal(root.useThemeAnimation, react.useThemeAnimation)

assert.equal(root.ThemeSelector, react.ThemeSelector)

assert.equal(root.ThemeSwitcher, react.ThemeSwitcher)

assert.equal(root.ThemeAnimationType, core.ThemeAnimationType)

assert.equal(core.ThemeAnimationType.CIRCLE, 'circle')

let updates = 0

await core.runThemeTransition(() => {
  updates++
}, null)

assert.equal(updates, 1)

assert.equal(core.getSlideFromCoords('top-right').a, 100)

assert.equal(core.ThemeAnimationType.SVG_LOGO, 'svg-logo')

console.log('Subpath import smoke test passed')
