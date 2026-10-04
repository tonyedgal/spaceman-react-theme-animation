import type {
  UseThemeAnimationReturn,
  ThemeTransitionInput,
} from '@space-man/react-theme-animation'
import type {
  useSpacemanTheme,
  useNextTheme,
  useViteTheme,
  useTanStackTheme,
} from '@space-man/react-theme-animation/react'

export function checkOptions(
  input: ThemeTransitionInput,
  hook: UseThemeAnimationReturn,
  spaceman: Readonly<ReturnType<typeof useSpacemanTheme>>,
  next: Readonly<ReturnType<typeof useNextTheme>>,
  vite: Readonly<ReturnType<typeof useViteTheme>>,
  tanstack: Readonly<ReturnType<typeof useTanStackTheme>>,
): void {
  for (const state of [hook, spaceman, next, vite, tanstack]) {
    void state.toggleTheme(input)
    void state.switchTheme('dark', input)
    void state.switchColorTheme('ocean', input)
    void state.toggleColorTheme(input)
    void state.createColorThemeToggle('ocean')(input)
  }
}
