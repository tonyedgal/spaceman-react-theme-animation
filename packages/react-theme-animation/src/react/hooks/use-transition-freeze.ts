import { useCallback } from 'react'
import { flushSync } from 'react-dom'

import { createStyle } from '../../core/utils/create-style'

const freezeTransitions = (nonce?: string): (() => void) => {
  const css = createStyle(nonce)
  css.textContent =
    '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
  document.head.appendChild(css)

  return (): void => {
    // the read forces a style recalc while transitions are still disabled.
    void window.getComputedStyle(document.body).opacity
    css.remove()
  }
}

export type TransitionFreeze = <T>(fn: () => T | Promise<T>) => Promise<T>

export function useTransitionFreeze(
  enabled: boolean,
  nonce?: string,
): TransitionFreeze {
  return useCallback(
    async <T>(fn: () => T | Promise<T>): Promise<T> => {
      if (!enabled) return fn()

      const release = freezeTransitions(nonce)

      try {
        const result = await flushSync(fn)
        release()

        return result
      } catch (error) {
        release()
        throw error
      }
    },
    [enabled, nonce],
  )
}
