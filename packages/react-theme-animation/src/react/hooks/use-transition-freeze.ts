import { useCallback } from 'react'

import { createStyle } from '../../core/utils/create-style'

const freezeTransitions = (nonce?: string): (() => void) => {
  const css = createStyle(nonce)
  css.textContent =
    '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
  document.head.appendChild(css)
  window.getComputedStyle(document.body)

  // react can commit the class after a 1 ms timer, so wait two frames.
  return (): void => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        css.remove()
      })
    })
  }
}

export type TransitionFreeze = <T>(fn: () => T | Promise<T>) => Promise<T>

export function useTransitionFreeze(
  enabled: boolean,
  nonce?: string,
): TransitionFreeze {
  return useCallback(
    async <T>(fn: () => T | Promise<T>): Promise<T> => {
      const release = enabled ? freezeTransitions(nonce) : undefined

      try {
        const result = await fn()
        release?.()

        return result
      } catch (error) {
        release?.()
        throw error
      }
    },
    [enabled, nonce],
  )
}
