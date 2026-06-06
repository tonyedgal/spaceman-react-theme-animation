import React, { createContext, useContext } from 'react'
import { ColorTheme, Theme } from '../../core/types'

export interface SharedThemeContextValue {
  ref: React.RefObject<HTMLButtonElement | null>
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
  switchTheme: (theme: Theme, animationOff?: boolean) => Promise<void>
  switchThemeFromElement?: (
    theme: Theme,
    element: HTMLButtonElement
  ) => Promise<void>
}

export const SharedThemeContext = createContext<SharedThemeContextValue | null>(
  null
)

export const useSharedThemeContext = (): SharedThemeContextValue | null => {
  return useContext(SharedThemeContext)
}
