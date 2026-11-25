import { expect, test, type Page } from '@playwright/test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  NextThemeProvider,
  TanStackStartThemeScript,
} from '@space-man/react-theme-animation/react'

function inlineScript(element: React.ReactElement): string {
  const match = /<script[^>]*>([\s\S]*?)<\/script>/.exec(
    renderToStaticMarkup(element),
  )

  if (!match) throw new Error('Missing bootstrap script')

  return match[1]
}

const colorThemes = ['default', 'ocean']

function nextScript(attribute: 'class' | 'data-theme'): React.ReactElement {
  return React.createElement(NextThemeProvider, {
    storageKey: 'theme',
    colorStorageKey: 'color-theme',
    attribute,
    defaultTheme: 'light',
    colorThemes,
    // oxlint-disable-next-line react/no-children-prop -- playwright rewrites jsx in specs, which breaks server rendering
    children: null,
  })
}

function tanStackScript(systemThemeMode: 'css' | 'js'): React.ReactElement {
  return React.createElement(TanStackStartThemeScript, {
    storageKey: 'theme',
    colorStorageKey: 'color-theme',
    defaultTheme: 'light',
    colorThemes,
    systemThemeMode,
  })
}

const bootstraps = {
  next: (): string => inlineScript(nextScript('class')),
  'next-data-theme': (): string => inlineScript(nextScript('data-theme')),
  tanstack: (): string => inlineScript(tanStackScript('js')),
  'tanstack-css': (): string => inlineScript(tanStackScript('css')),
}

async function runBootstrap(
  page: Readonly<Page>,
  code: string,
  stored: Readonly<Record<string, string>>,
): Promise<{ classes: string[]; dataTheme: string | null }> {
  await page.goto('/bootstrap.html')

  return page.evaluate(
    ([source, values]) => {
      localStorage.clear()

      for (const [key, value] of Object.entries(values))
        localStorage.setItem(key, value)
      const root = document.documentElement
      root.removeAttribute('class')
      root.removeAttribute('style')
      root.removeAttribute('data-theme')
      const script = document.createElement('script')
      script.textContent = source
      document.head.append(script)
      script.remove()

      return {
        classes: [...root.classList],
        dataTheme: root.getAttribute('data-theme'),
      }
    },
    [code, stored] as const,
  )
}

for (const [name, build] of Object.entries(bootstraps)) {
  test(`${name} bootstrap keeps valid stored values and drops stale ones`, async ({
    page,
  }) => {
    const valid = await runBootstrap(page, build(), {
      theme: 'dark',
      'color-theme': 'ocean',
    })

    expect(valid.classes).toContain('theme-ocean')
    expect(
      name === 'next-data-theme' ? valid.dataTheme : valid.classes,
    ).toContain('dark')

    const stale = await runBootstrap(page, build(), {
      theme: 'sepia',
      'color-theme': 'removed-palette',
    })

    expect(stale.classes).not.toContain('theme-removed-palette')
    expect(stale.classes).not.toContain('sepia')
    expect(stale.classes).not.toContain('dark')
    expect(stale.dataTheme ?? 'light').toBe('light')
  })
}
