import { resolveThemeForServer } from './utils/animations'
import { ColorTheme, Theme } from './types'

export const STORAGE_KEY = 'theme'
export const COLOR_STORAGE_KEY = 'color-theme'
export const GLOBAL_CLASS_NAME = 'dark'
export const COLOR_THEME_PREFIX = 'theme-'

export type ServerResolvedTheme = 'light' | 'dark' | 'system'

export interface ServerThemeData {
  theme: ServerResolvedTheme
  themePreference: Theme
  colorTheme: ColorTheme
}

export function buildServerThemeData(
  themeCookie: string | undefined,
  colorThemeCookie: string | undefined,
  options: { defaultTheme?: Theme; defaultColorTheme?: ColorTheme } = {}
): ServerThemeData {
  const { defaultTheme = 'system', defaultColorTheme = 'default' } = options
  const themePreference = (themeCookie as Theme | undefined) ?? defaultTheme
  const colorTheme = colorThemeCookie ?? defaultColorTheme

  return {
    theme: resolveThemeForServer(themePreference),
    themePreference,
    colorTheme,
  }
}

export { resolveThemeForServer }
