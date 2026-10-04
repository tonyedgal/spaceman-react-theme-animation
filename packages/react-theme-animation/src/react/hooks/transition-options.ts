import type { ColorThemeToggle, ThemeTransitionInput } from '../../core/types'

/** A keyboard click commits immediately; a pointer click keeps its CSS origin. */
export function getColorTransitionOptions(
  input: Readonly<Parameters<ColorThemeToggle>[0]>,
): ThemeTransitionInput | undefined {
  if (input === undefined || input === true || input === false) return input

  return 'currentTarget' in input
    ? { element: input.currentTarget, animationOff: input.detail === 0 }
    : input
}
