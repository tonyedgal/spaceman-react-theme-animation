import type {
  ColorTheme,
  UseThemeAnimationReturn,
} from '@space-man/react-theme-animation'
import type {
  useSpacemanTheme,
  useNextTheme,
  useViteTheme,
  useTanStackTheme,
} from '@space-man/react-theme-animation/react'

export function checkColorThemes(
  hook: UseThemeAnimationReturn,
  spaceman: Readonly<ReturnType<typeof useSpacemanTheme>>,
  next: Readonly<ReturnType<typeof useNextTheme>>,
  vite: Readonly<ReturnType<typeof useViteTheme>>,
  tanstack: Readonly<ReturnType<typeof useTanStackTheme>>,
): readonly ColorTheme[][] {
  return [hook, spaceman, next, vite, tanstack].map((state) => [
    ...state.colorThemes,
  ])
}
