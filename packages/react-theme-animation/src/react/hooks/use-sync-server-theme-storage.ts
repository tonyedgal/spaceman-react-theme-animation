import { useEffect } from 'react'
import { ColorTheme, Theme } from '../../core/types'

const isBrowser = typeof window !== 'undefined'

export const useSyncServerThemeStorage = ({
  enabled,
  theme,
  colorTheme,
  storageKey,
  colorStorageKey,
}: {
  enabled: boolean
  theme?: Theme
  colorTheme?: ColorTheme
  storageKey: string
  colorStorageKey: string
}): void => {
  useEffect(() => {
    if (!enabled || !isBrowser) return

    if (theme) {
      localStorage.setItem(storageKey, theme)
    }
    if (colorTheme) {
      localStorage.setItem(colorStorageKey, colorTheme)
    }
  }, [enabled, theme, colorTheme, storageKey, colorStorageKey])
}
