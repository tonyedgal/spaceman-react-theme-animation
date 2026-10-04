import { z } from 'zod'

import type { UseThemeAnimationReturn } from '../../src/core/types'

export type FixtureThemeState = Omit<UseThemeAnimationReturn, 'systemTheme'> & {
  readonly switchThemeFromElement?: (
    theme: 'light' | 'dark',
    element: HTMLButtonElement,
  ) => Promise<void>
}

export const animationFramesSchema = z.object({
  clipPath: z.array(z.string()).optional(),
  transform: z.array(z.string()).optional(),
  maskImage: z.array(z.string()).optional(),
  maskPosition: z.array(z.string()).optional(),
  maskSize: z.array(z.string()).optional(),
  maskRepeat: z.array(z.string()).optional(),
})

export const animationOptionsSchema = z.object({
  duration: z.number(),
  easing: z.string(),
  fill: z.enum(['none', 'forwards', 'backwards', 'both', 'auto']),
  pseudoElement: z.string().optional(),
})

export function withoutPseudoOptions(
  input: Readonly<Parameters<Element['animate']>[1]>,
): KeyframeAnimationOptions {
  return { ...animationOptionsSchema.parse(input), pseudoElement: undefined }
}

export interface Inspection {
  animations: {
    readonly frames: z.infer<typeof animationFramesSchema>
    readonly options: z.infer<typeof animationOptionsSchema>
  }[]
  transitions: ViewTransition[]
  callbacks: string[]
  paused: boolean
}

export function required<T>(value: T | null | undefined): NonNullable<T> {
  if (value === null || value === undefined)
    throw new Error('Missing fixture value')

  return value
}

declare global {
  interface Window {
    themeFixture: {
      readonly preloadLogo: () => Promise<void>
      readonly state: FixtureThemeState
      readonly inspection: Inspection
      readonly required: typeof required
      readonly withoutPseudoOptions: typeof withoutPseudoOptions
    }
  }
}
