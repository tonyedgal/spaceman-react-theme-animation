import type { Theme } from '../../core/types'

export const getNextResolvedTheme = (
  resolvedTheme: 'light' | 'dark',
): Theme => {
  return resolvedTheme === 'dark' ? 'light' : 'dark'
}
