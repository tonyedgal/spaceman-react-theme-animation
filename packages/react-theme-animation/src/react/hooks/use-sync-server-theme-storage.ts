import { useEffect } from 'react'

import type { ColorTheme, Theme } from '../../core/types'

const isBrowser = 'window' in globalThis

export const useSyncServerThemeStorage = ({
  enabled,
  theme,
  colorTheme,
  storageKey,
  colorStorageKey,
}: {
  readonly enabled: boolean
  readonly theme?: Theme
  readonly colorTheme?: ColorTheme
  readonly storageKey: string
  readonly colorStorageKey: string
}): void => {
  useEffect(() => {
    if (!enabled || !isBrowser) return

    if (theme) {
      localStorage.setItem(storageKey, theme)
    }

    if (colorTheme !== undefined && colorTheme !== '') {
      localStorage.setItem(colorStorageKey, colorTheme)
    }
  }, [enabled, theme, colorTheme, storageKey, colorStorageKey])
}
