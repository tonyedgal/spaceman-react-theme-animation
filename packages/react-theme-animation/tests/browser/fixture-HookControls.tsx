import React from 'react'
import { z } from 'zod'

import {
  ThemeAnimationType,
  TRANSITION_DIRECTIONS,
  useThemeAnimation,
} from '@space-man/react-theme-animation/react'

import { config, copy, dimension, params } from './fixture-config'
import { Controls } from './fixture-Controls'

import './fixture.css'

export function HookControls(): React.JSX.Element {
  const [options, setOptions] = React.useState(config)
  const state = useThemeAnimation(options)
  const asset = React.useRef<string | null>(null)
  React.useEffect(
    () => (): void => {
      if (asset.current !== null) URL.revokeObjectURL(asset.current)
    },
    [],
  )

  return (
    <Controls state={state} logo={options.logo}>
      {params.has('gallery') && (
        <div className='effect-options'>
          <label>
            {copy.effect}
            <select
              aria-label='Effect'
              value={options.animationType}
              onChange={(event) => {
                setOptions({
                  ...options,
                  animationType: z
                    .enum(ThemeAnimationType)
                    .parse(event.target.value),
                })
              }}
            >
              {Object.values(ThemeAnimationType).map((effect) => (
                <option key={effect} value={effect}>
                  {effect}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.direction}
            <select
              value={options.clipPathDirection}
              onChange={(event) => {
                setOptions({
                  ...options,
                  clipPathDirection: z
                    .enum(TRANSITION_DIRECTIONS)
                    .parse(event.target.value),
                })
              }}
            >
              {TRANSITION_DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </label>
          <label>
            {copy.origin}
            <select
              value={options.animationPosition ?? 'trigger'}
              onChange={(event) => {
                setOptions({
                  ...options,
                  animationPosition: z
                    .enum(['trigger', 'center', ...TRANSITION_DIRECTIONS])
                    .parse(event.target.value),
                })
              }}
            >
              {['trigger', 'center', ...TRANSITION_DIRECTIONS].map(
                (position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ),
              )}
            </select>
          </label>
          <div className='logo-dimensions'>
            <label>
              {copy.logoWidth}
              <input
                type='text'
                inputMode='numeric'
                placeholder='Auto'
                value={options.logoWidth ?? ''}
                onChange={(event) => {
                  setOptions({
                    ...options,
                    logoWidth: dimension(event.target.value),
                  })
                }}
              />
            </label>
            <label>
              {copy.logoHeight}
              <input
                type='text'
                inputMode='numeric'
                placeholder='Auto'
                value={options.logoHeight ?? ''}
                onChange={(event) => {
                  setOptions({
                    ...options,
                    logoHeight: dimension(event.target.value),
                  })
                }}
              />
            </label>
          </div>
          <label>
            {copy.svgLogo}
            <input
              type='file'
              accept='image/svg+xml,.svg'
              onChange={(event) => {
                const file = event.target.files?.[0]

                if (!file) return

                if (asset.current !== null) URL.revokeObjectURL(asset.current)
                asset.current = URL.createObjectURL(file)
                setOptions({
                  ...options,
                  logo: asset.current,
                  logoLight: undefined,
                  logoDark: undefined,
                  animationType: ThemeAnimationType.SVG_LOGO,
                })
              }}
            />
          </label>
          <p>{copy.uploadALogoThenClickElementToggle}</p>
        </div>
      )}
    </Controls>
  )
}
