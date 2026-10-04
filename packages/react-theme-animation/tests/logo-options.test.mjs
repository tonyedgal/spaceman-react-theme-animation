import assert from 'node:assert/strict'
import { test } from 'node:test'

import { getThemeLogoOptions } from '../src/core/logo.ts'

test('reject incomplete and mixed destination assets for JavaScript callers', () => {
  assert.throws(
    () => getThemeLogoOptions({ logoLight: '/light.svg' }),
    /must both be provided/,
  )
  assert.throws(
    () => getThemeLogoOptions({ logoDark: '/dark.svg' }),
    /must both be provided/,
  )
  assert.throws(
    () =>
      getThemeLogoOptions({
        logo: '/logo.svg',
        logoLight: '/light.svg',
        logoDark: '/dark.svg',
      }),
    /not both/,
  )
  assert.deepEqual(
    getThemeLogoOptions({ logoLight: '/light.svg', logoDark: '/dark.svg' }),
    { logoLight: '/light.svg', logoDark: '/dark.svg' },
  )
})
