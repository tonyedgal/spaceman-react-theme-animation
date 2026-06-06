import { Theme } from '../../core/types'

export const withElementAsRef = async (
  ref: React.RefObject<HTMLButtonElement | null>,
  element: HTMLButtonElement,
  run: () => Promise<void>
) => {
  if (ref.current) {
    const originalRef = ref.current
    Object.defineProperty(ref, 'current', {
      value: element,
      writable: true,
      configurable: true,
    })
    await run()
    Object.defineProperty(ref, 'current', {
      value: originalRef,
      writable: true,
      configurable: true,
    })
    return
  }

  Object.defineProperty(ref, 'current', {
    value: element,
    writable: true,
    configurable: true,
  })
  await run()
}

export const getBrowserSystemTheme = (): 'light' | 'dark' => {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const getNextResolvedTheme = (
  resolvedTheme: 'light' | 'dark'
): Theme => {
  return resolvedTheme === 'dark' ? 'light' : 'dark'
}
