import { useCallback } from 'react'

const freezeTransitions = (): (() => void) => {
  const css = document.createElement('style')
  css.textContent =
    '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
  document.head.appendChild(css)
  window.getComputedStyle(document.body)

  return (): void => {
    setTimeout(() => {
      css.remove()
    }, 1)
  }
}

export type TransitionFreeze = <T>(fn: () => T | Promise<T>) => Promise<T>

export function useTransitionFreeze(enabled: boolean): TransitionFreeze {
  return useCallback(
    async <T>(fn: () => T | Promise<T>): Promise<T> => {
      const release = enabled ? freezeTransitions() : undefined

      try {
        const result = await fn()
        release?.()

        return result
      } catch (error) {
        release?.()
        throw error
      }
    },
    [enabled],
  )
}
