import { useEffect } from 'react'

import type { ColorTheme, Theme } from '../../core/types'
import { writeThemeStorage } from './theme-storage'

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
      writeThemeStorage(storageKey, theme)
    }

    if (colorTheme !== undefined && colorTheme !== '') {
      writeThemeStorage(colorStorageKey, colorTheme)
    }
  }, [enabled, theme, colorTheme, storageKey, colorStorageKey])
}
