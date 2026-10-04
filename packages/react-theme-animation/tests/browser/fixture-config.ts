import { z } from 'zod'

import {
  ThemeAnimationType,
  TRANSITION_DIRECTIONS,
} from '@space-man/react-theme-animation/react'

import { getThemeLogoOptions } from '../../src/core/logo'
import type { Inspection } from './fixture-types'
import { animationFramesSchema, animationOptionsSchema } from './fixture-types'

import './fixture.css'

export const copy = {
  themeTransitions: 'Theme transitions',
  originMarkerAndSlowedPlaybackForBrowser:
    'Origin marker and slowed playback for browser inspection.',
  dpr: 'DPR ',
  separator: ' · ',
  separator2: ' × ',
  cssPx: ' CSS px ·',
  separator3: ' ',
  freeze: 'Freeze ',
  resumeR: 'Resume (R)',
  refToggle: 'Ref toggle',
  elementToggle: 'Element toggle',
  changePalette: 'Change palette',
  cyclePalette: 'Cycle palette',
  rosePalette: 'Rose palette',
  aThemedSurface: 'A themed surface',
  textAndCardsShouldStayStillAs:
    'Text and cards should stay still as the circle expands.',
  card: 'Card ',
  effect: 'Effect',
  direction: 'Direction',
  origin: 'Origin',
  logoWidth: 'Logo width',
  logoHeight: 'Logo height',
  svgLogo: 'SVG logo',
  uploadALogoThenClickElementToggle:
    'Upload a logo, then click Element toggle or Change palette. R resumes frozen playback.',
}

export const dimension = (
  value: string | null,
): number | 'auto' | undefined => {
  if (value === null || value === '') return undefined

  return value === 'auto' ? 'auto' : z.coerce.number().positive().parse(value)
}

export const params = new URLSearchParams(location.search)

export const animationType = z
  .enum(ThemeAnimationType)
  .parse(params.get('animation') ?? 'circle')

export const duration = Number(params.get('duration') ?? 750)

export const freezeProgress = Math.min(
  1,
  Math.max(0, Number(params.get('progress') ?? 0.05)),
)

document.documentElement.dataset.origin = params.get('corner') ?? 'bottom-right'

export const colorThemes = ['default', 'ocean', 'rose']

export const config = {
  animationType,
  duration: params.has('defaults') ? undefined : duration,
  easing: params.get('easing') ?? undefined,
  colorThemes,
  defaultTheme: 'light' as const,
  clipPathDirection: z
    .enum(TRANSITION_DIRECTIONS)
    .parse(params.get('direction') ?? 'top-left'),
  animationPosition: z
    .enum(['trigger', 'center', ...TRANSITION_DIRECTIONS])
    .optional()
    .parse(params.get('position') ?? undefined),
  ...getThemeLogoOptions({
    logo: params.get('logo') ?? undefined,
    logoLight: params.get('logoLight') ?? undefined,
    logoDark: params.get('logoDark') ?? undefined,
  }),
  logoWidth: dimension(params.get('logoWidth')),
  logoHeight: dimension(params.get('logoHeight')),
}

export const provider = params.get('provider') ?? 'hook'

export const inspection: Inspection = {
  animations: [],
  transitions: [],
  callbacks: [],
  paused: false,
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyR' && !event.repeat) {
    document.getAnimations().forEach((animation) => {
      animation.play()
    })
  }
})

export const originalAnimate = document.documentElement.animate.bind(
  document.documentElement,
)

document.documentElement.animate = function (frames, options): Animation {
  const animation = originalAnimate(frames, options)
  inspection.animations.push({
    frames: animationFramesSchema.parse(frames),
    options: animationOptionsSchema.parse(options),
  })

  if (inspection.paused) {
    animation.pause()
    animation.currentTime = duration * freezeProgress

    for (const layer of document.getAnimations()) {
      if (
        layer instanceof CSSAnimation &&
        layer.animationName.startsWith('spaceman-theme-logo-')
      ) {
        layer.pause()
        layer.currentTime = duration * freezeProgress
      }
    }
  }

  return animation
}

if ('startViewTransition' in document) {
  const start = document.startViewTransition.bind(document)
  document.startViewTransition = (update): ViewTransition => {
    const transition = start(update)
    inspection.transitions.push(transition)

    return transition
  }
}

export const callbacks = {
  onServerThemeChange: (theme: string): void => {
    inspection.callbacks.push(theme)
  },
  onServerColorThemeChange: (theme: string): void => {
    inspection.callbacks.push(theme)
  },
}
