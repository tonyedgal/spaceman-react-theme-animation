import type {
  UseThemeAnimationReturn,
  ThemeTransitionInput,
} from '../../src/core/types'
import {
  useSpacemanTheme,
  useNextTheme,
  useViteTheme,
  useTanStackTheme,
} from '../../src/react'
export function checkOptions(
  input: ThemeTransitionInput,
  hook: UseThemeAnimationReturn,
  spaceman: ReturnType<typeof useSpacemanTheme>,
  next: ReturnType<typeof useNextTheme>,
  vite: ReturnType<typeof useViteTheme>,
  tanstack: ReturnType<typeof useTanStackTheme>,
) {
  for (const state of [hook, spaceman, next, vite, tanstack]) {
    void state.toggleTheme(input)
    void state.switchTheme('dark', input)
    void state.switchColorTheme('ocean', input)
    void state.toggleColorTheme(input)
    void state.createColorThemeToggle('ocean')(input)
  }
}
