import { useEffect, useRef } from 'react'

import type { ColorTheme, Theme } from '../../core/types'
import { writeThemeStorage } from './theme-storage'
import { useHydrated } from './use-hydrated'

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
  const isHydrated = useHydrated()
  const seeded = useRef(false)

  useEffect(() => {
    if (!enabled || !isBrowser || !isHydrated || seeded.current) return
    seeded.current = true

    if (theme) {
      writeThemeStorage(storageKey, theme)
    }

    if (colorTheme !== undefined && colorTheme !== '') {
      writeThemeStorage(colorStorageKey, colorTheme)
    }
  }, [enabled, isHydrated, theme, colorTheme, storageKey, colorStorageKey])
}
