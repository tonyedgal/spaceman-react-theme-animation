import { expect, test } from '@playwright/test'
import React from 'react'
import { renderToString } from 'react-dom/server'

import { HydrationApp } from './hydration-app'

for (const savedPreference of [true, false]) {
  test(`hydrates server defaults with ${savedPreference ? 'saved preferences' : 'a dark system preference'}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.addInitScript((saved) => {
      if (saved) {
        localStorage.setItem('theme', 'dark')
        localStorage.setItem('color-theme', 'ocean')
      }
    }, savedPreference)
    const markup = renderToString(React.createElement(HydrationApp))
    expect(markup).toContain('system')
    expect(markup).toContain('default')
    await page.route('**/hydration.html', async (route) => {
      await route.fulfill({
        contentType: 'text/html',
        body: `<html><body><div id="root">${markup}</div><script type="module" src="/hydration-fixture.tsx"></script></body></html>`,
      })
    })
    await page.goto('/hydration.html')
    await expect(page.locator('output')).toHaveText(
      savedPreference ? 'dark:ocean:dark:dark' : 'system:default:dark:dark',
    )
    expect(errors).toEqual([])
  })
}
