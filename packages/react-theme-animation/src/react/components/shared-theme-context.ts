import React, { createContext, useContext } from 'react'

import type { ColorTheme, Theme } from '../../core/types'

export interface SharedThemeContextValue {
  readonly ref: React.RefObject<HTMLButtonElement | null>
  readonly theme: Theme
  readonly colorTheme: ColorTheme
  readonly setTheme: (theme: Theme) => void
  readonly setColorTheme: (colorTheme: ColorTheme) => void
  readonly switchTheme: (theme: Theme, animationOff?: boolean) => Promise<void>
  readonly switchThemeFromElement?: (
    theme: Theme,
    element: HTMLButtonElement,
  ) => Promise<void>
}

export const SharedThemeContext = createContext<SharedThemeContextValue | null>(
  null,
)

export const useSharedThemeContext = (): SharedThemeContextValue | null => {
  return useContext(SharedThemeContext)
}
