import type { Theme } from '../../core/types'

export const getBrowserSystemTheme = (): 'light' | 'dark' => {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const getNextResolvedTheme = (
  resolvedTheme: 'light' | 'dark',
): Theme => {
  return resolvedTheme === 'dark' ? 'light' : 'dark'
}
