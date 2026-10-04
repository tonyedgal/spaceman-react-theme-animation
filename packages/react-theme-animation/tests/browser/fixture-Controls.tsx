import React from 'react'

import {
  preloadThemeLogo,
  ThemeSelector,
  ThemeSwitcher,
} from '@space-man/react-theme-animation/react'

import { colorThemes, config, copy, inspection, params } from './fixture-config'
import type { FixtureThemeState } from './fixture-types'
import { required, withoutPseudoOptions } from './fixture-types'

import './fixture.css'

export function Controls({
  state,
  children,
  logo,
}: Readonly<{
  state: FixtureThemeState
  children?: React.ReactNode
  logo?: string
}>): React.JSX.Element {
  const { ref: buttonRef, ...themeState } = state

  const [frozen, setFrozen] = React.useState(false)
  React.useLayoutEffect(() => {
    Object.assign(window, {
      themeFixture: {
        required,
        withoutPseudoOptions,
        state,
        inspection,
        preloadLogo: async (): Promise<void> => {
          await Promise.all(
            [logo ?? config.logo, config.logoLight, config.logoDark].map(
              async (asset) =>
                asset !== undefined && asset !== ''
                  ? preloadThemeLogo(asset)
                  : Promise.resolve(),
            ),
          )
        },
      },
    })
  }, [state, logo])

  return (
    <>
      <aside>
        <h1>{copy.themeTransitions}</h1>
        <p>{copy.originMarkerAndSlowedPlaybackForBrowser}</p>
        {children}
        <output id='diagnostics'>
          {copy.dpr}
          {devicePixelRatio} {copy.separator}
          {innerWidth} {copy.separator2}
          {innerHeight} {copy.cssPx}
          {copy.separator3}
          {themeState.theme} {copy.separator}
          {themeState.colorTheme}
        </output>
        <button
          type='button'
          id='freeze'
          onClick={() => {
            inspection.paused = !frozen
            setFrozen(!frozen)
          }}
        >
          {copy.freeze}
          {frozen ? 'on' : 'off'}
        </button>
        <button
          type='button'
          id='resume'
          onClick={() => {
            document.getAnimations().forEach((animation) => {
              animation.play()
            })
          }}
        >
          {copy.resumeR}
        </button>
      </aside>
      <main>
        <div id='transformed'>
          <button
            type='button'
            id='ref-toggle'
            ref={buttonRef}
            onClick={() => void state.toggleTheme()}
          >
            {copy.refToggle}
          </button>
        </div>
        <button
          type='button'
          id='element-toggle'
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()

            const marker = window.themeFixture.required(
              document.getElementById('marker'),
            )

            marker.style.left = `${rect.left + rect.width / 2}px`
            marker.style.top = `${rect.top + rect.height / 2}px`
            marker.hidden = false
            void state.toggleTheme({ element: event.currentTarget })
          }}
        >
          {copy.elementToggle}
        </button>
        <button
          type='button'
          id='palette'
          onClick={(event) =>
            void state.switchColorTheme(
              themeState.colorTheme === 'ocean' ? 'rose' : 'ocean',
              { element: event.currentTarget },
            )
          }
        >
          {copy.changePalette}
        </button>
        <button
          type='button'
          id='cycle'
          onClick={(event) => {
            void state.toggleColorTheme(event).catch(console.error)
          }}
        >
          {copy.cyclePalette}
        </button>
        <button
          type='button'
          id='target-palette'
          onClick={(event) => {
            void state
              .createColorThemeToggle('rose')(event)
              .catch(console.error)
          }}
        >
          {copy.rosePalette}
        </button>
        <div className='preview'>
          <h2>{copy.aThemedSurface}</h2>
          <p>{copy.textAndCardsShouldStayStillAs}</p>
        </div>
        {params.has('widgets') && (
          <>
            <ThemeSwitcher
              currentTheme={themeState.theme}
              onThemeChange={(value) => {
                state.setTheme(value)
              }}
            />
            <ThemeSelector
              className='palette-selector'
              colorThemeLabel='Palette'
              placeholder='Pick a palette'
              colorThemes={colorThemes}
              currentColorTheme={themeState.colorTheme}
              onColorThemeChange={(value) => {
                inspection.callbacks.push(`selector:${value}`)
                state.setColorTheme(value)
              }}
            />
          </>
        )}
        <div className='tiles'>
          {Array.from({ length: 80 }, (_, i) => (
            <article key={`card-${i + 1}`}>
              {copy.card}
              {i + 1}
            </article>
          ))}
        </div>
      </main>
      <div id='marker' hidden />
    </>
  )
}
