import type { ComponentProps } from 'react'

import type { UseThemeAnimationProps } from '@space-man/react-theme-animation'
import { ThemeAnimationType } from '@space-man/react-theme-animation'
import type {
  NextThemeProvider,
  SpacemanThemeProvider,
  TanStackThemeProvider,
  ViteThemeProvider,
} from '@space-man/react-theme-animation/react'

type NextThemeProviderProps = ComponentProps<typeof NextThemeProvider>

type SpacemanThemeProviderProps = ComponentProps<typeof SpacemanThemeProvider>

type TanStackThemeProviderProps = ComponentProps<typeof TanStackThemeProvider>

type ViteThemeProviderProps = ComponentProps<typeof ViteThemeProvider>

type AnimationTypeProp<T extends { readonly animationType?: unknown }> =
  NonNullable<T['animationType']>

export const literals: readonly [
  AnimationTypeProp<UseThemeAnimationProps>,
  AnimationTypeProp<SpacemanThemeProviderProps>,
  AnimationTypeProp<NextThemeProviderProps>,
  AnimationTypeProp<ViteThemeProviderProps>,
  AnimationTypeProp<TanStackThemeProviderProps>,
] = ['circle', 'blur-circle', 'polygon-gradient', 'svg-logo', 'slide']

export const members: readonly AnimationTypeProp<ViteThemeProviderProps>[] = [
  ThemeAnimationType.CIRCLE,
  ThemeAnimationType.TRIANGLE,
]

// @ts-expect-error unknown animation names stay rejected.
export const unknown: AnimationTypeProp<NextThemeProviderProps> = 'spiral'
