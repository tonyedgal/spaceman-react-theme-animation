import { expect, test } from '@playwright/test'

for (const provider of ['hook', 'ui', 'next', 'vite', 'tanstack']) {
  test(`${provider} updates mode and palette when storage is blocked`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.addInitScript(() => {
      Storage.prototype.getItem = (): never => {
        throw new DOMException('Blocked storage', 'SecurityError')
      }

      Storage.prototype.setItem = (): never => {
        throw new DOMException('Storage quota', 'QuotaExceededError')
      }
    })
    await page.goto(`/?provider=${provider}`)
    await expect(page.locator('html')).toHaveClass(/theme-default/)
    await page.evaluate(async () => {
      await window.themeFixture.state.switchColorTheme('ocean', true)
      await window.themeFixture.state.switchTheme('dark', true)
    })
    await expect(page.locator('html')).toHaveClass(/theme-ocean/)
    await expect(page.locator('html')).toHaveClass(/dark/)
    expect(errors).toEqual([])
  })

  test(`${provider} resumes persistence after a failed write`, async ({
    page,
  }) => {
    await page.goto(`/?provider=${provider}`)
    await expect(page.locator('html')).toHaveClass(/theme-default/)
    await page.evaluate(async () => {
      const descriptor = Object.getOwnPropertyDescriptor(
        Storage.prototype,
        'setItem',
      )

      if (!descriptor) throw new Error('Missing storage method')
      Storage.prototype.setItem = (): never => {
        throw new DOMException('Blocked storage', 'SecurityError')
      }

      try {
        await window.themeFixture.state.switchColorTheme('ocean', true)
      } finally {
        Object.defineProperty(Storage.prototype, 'setItem', descriptor)
      }
    })
    await expect(page.locator('html')).toHaveClass(/theme-ocean/)
    await page.evaluate(async () => {
      await window.themeFixture.state.switchColorTheme('rose', true)
    })
    await expect(page.locator('html')).toHaveClass(/theme-rose/)
    expect(
      await page.evaluate(
        (key) => localStorage.getItem(key),
        provider === 'vite' ? 'vite-color-theme' : 'color-theme',
      ),
    ).toBe('rose')
  })

  test(`${provider} forwards selector styling, label, and callbacks`, async ({
    page,
  }) => {
    await page.goto(`/?provider=${provider}&widgets`)
    const trigger = page.getByRole('combobox', { name: 'Palette' })
    await expect(page.locator('.palette-selector')).toBeVisible()
    await trigger.click()
    await page.getByRole('option', { name: 'ocean', exact: true }).click()
    await expect(page.locator('html')).toHaveClass(/theme-ocean/)
    expect(
      await page.evaluate(() =>
        window.themeFixture.inspection.callbacks.filter(
          (value) => value === 'selector:ocean',
        ),
      ),
    ).toEqual(['selector:ocean'])
  })
}
