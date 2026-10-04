import type { ColorTheme, Theme } from '../core/types'
import { resolveThemeForServer } from '../core/utils/animations'

export const STORAGE_KEY = 'theme'

export const COLOR_STORAGE_KEY = 'color-theme'

export const GLOBAL_CLASS_NAME = 'dark'

export const COLOR_THEME_PREFIX = 'theme-'

export type ServerResolvedTheme = 'light' | 'dark' | 'system'

export interface ServerThemeData {
  readonly theme: ServerResolvedTheme
  readonly themePreference: Theme
  readonly colorTheme: ColorTheme
}

export function buildServerThemeData(
  themeCookie: string | undefined,
  colorThemeCookie: string | undefined,
  options: {
    readonly defaultTheme?: Theme
    readonly defaultColorTheme?: ColorTheme
  } = {},
): ServerThemeData {
  const { defaultTheme = 'system', defaultColorTheme = 'default' } = options

  const themePreference =
    themeCookie === 'light' ||
    themeCookie === 'dark' ||
    themeCookie === 'system'
      ? themeCookie
      : defaultTheme

  const colorTheme = colorThemeCookie ?? defaultColorTheme

  return {
    theme: resolveThemeForServer(themePreference),
    themePreference,
    colorTheme,
  }
}

export { resolveThemeForServer }
