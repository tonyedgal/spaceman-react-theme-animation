import React from 'react'
import { createRoot } from 'react-dom/client'

import { getThemeLogoOptions } from '../../src/core/logo'
import {
  ThemeAnimationType,
  useThemeAnimation,
  SpacemanThemeProvider,
  useSpacemanTheme,
  NextThemeProvider,
  useNextTheme,
  ViteThemeProvider,
  useViteTheme,
  TanStackThemeProvider,
  useTanStackTheme,
  ThemeSelector,
  ThemeSwitcher,
  TRANSITION_DIRECTIONS,
  preloadThemeLogo,
  type TransitionDirection,
  type AnimationPosition,
} from '../../src/react'

import './fixture.css'

const dimension = (value: string | null): number | 'auto' | undefined =>
  value === 'auto' ? 'auto' : value ? Number(value) : undefined

const params = new URLSearchParams(location.search)
const animationType = (params.get('animation') ??
  'circle') as ThemeAnimationType
const duration = Number(params.get('duration') ?? 750)
const freezeProgress = Math.min(
  1,
  Math.max(0, Number(params.get('progress') ?? 0.05)),
)
document.documentElement.dataset.origin = params.get('corner') ?? 'bottom-right'
const colorThemes = ['default', 'ocean', 'rose']
const config = {
  animationType,
  duration,
  easing: params.get('easing') ?? undefined,
  colorThemes,
  defaultTheme: 'light' as const,
  clipPathDirection: (params.get('direction') ??
    'top-left') as TransitionDirection,
  animationPosition: (params.get('position') ?? undefined) as
    | AnimationPosition
    | undefined,
  ...getThemeLogoOptions({
    logo: params.get('logo') ?? undefined,
    logoLight: params.get('logoLight') ?? undefined,
    logoDark: params.get('logoDark') ?? undefined,
  }),
  logoWidth: dimension(params.get('logoWidth')),
  logoHeight: dimension(params.get('logoHeight')),
}
const provider = params.get('provider') ?? 'hook'

// Only the test page exposes inspection hooks; the package ships none of these.
const inspection = {
  animations: [] as {
    frames: PropertyIndexedKeyframes | Keyframe[] | null
    options: KeyframeAnimationOptions | number | undefined
  }[],
  transitions: [] as ViewTransition[],
  callbacks: [] as string[],
  paused: false,
  probes: [] as Record<string, unknown>[],
}

// Optional diagnostics record frame timestamps and a few tail checkpoints. They
// don't drive animation or update React/DOM on each frame.
function inspectTail(animation: Animation) {
  if (!params.has('probe')) return
  const started = performance.now()
  const effect = animation.effect as KeyframeEffect
  const samples: { at: number; time: number; progress: number | null }[] = []
  const checkpoints: { time: number; clip: string }[] = []
  const viewportEvents: string[] = []
  const pseudo = '::view-transition-new(root)'
  const snapshot = getComputedStyle(document.documentElement, pseudo)
  const geometry = {
    viewport: [innerWidth, innerHeight],
    client: [
      document.documentElement.clientWidth,
      document.documentElement.clientHeight,
    ],
    snapshot: [snapshot.width, snapshot.height],
    dpr: devicePixelRatio,
    screen: [screen.width, screen.height],
    visualViewport: [
      visualViewport?.width,
      visualViewport?.height,
      visualViewport?.scale,
    ],
    easing: effect.getTiming().easing,
    frames: effect.getKeyframes(),
  }
  let request = 0
  let checkpoint = 0
  const thresholds = [0.9, 0.95, 0.975, 0.99, 0.999]
  const sample = (at: number) => {
    const time =
      typeof animation.currentTime === 'number' ? animation.currentTime : 0
    samples.push({ at, time, progress: effect.getComputedTiming().progress })
    if (time / duration >= thresholds[checkpoint]) {
      checkpoints.push({
        time,
        clip: getComputedStyle(document.documentElement, pseudo).clipPath,
      })
      checkpoint++
    }
    request = requestAnimationFrame(sample)
  }
  const resized = () =>
    viewportEvents.push(
      `resize at ${Math.round(performance.now() - started)} ms: ${innerWidth}×${innerHeight}`,
    )
  const visibility = () =>
    viewportEvents.push(`visibility: ${document.visibilityState}`)
  window.addEventListener('resize', resized)
  document.addEventListener('visibilitychange', visibility)
  request = requestAnimationFrame(sample)
  const finish = (outcome: string) => {
    cancelAnimationFrame(request)
    window.removeEventListener('resize', resized)
    document.removeEventListener('visibilitychange', visibility)
    const gaps = samples
      .slice(1)
      .map((frame, i) => ({ gap: frame.at - samples[i].at, time: frame.time }))
    const summary = (items: typeof gaps) => {
      const values = items.map((item) => item.gap).sort((a, b) => a - b)
      return {
        count: values.length,
        maxMs: values.at(-1),
        p95Ms: values[Math.floor(values.length * 0.95)],
      }
    }
    const result = {
      ...geometry,
      outcome,
      elapsedMs: performance.now() - started,
      lastSampleMs: samples.at(-1)?.time,
      firstHalf: summary(gaps.filter((frame) => frame.time < duration / 2)),
      finalQuarter: summary(
        gaps.filter((frame) => frame.time >= duration * 0.75),
      ),
      checkpoints,
      viewportEvents,
    }
    inspection.probes.push({ ...result, samples })
    const output = document.getElementById(
      'probe-output',
    ) as HTMLTextAreaElement | null
    if (output) output.value = JSON.stringify(result, null, 2)
  }
  void animation.finished.then(
    () => finish('finished'),
    () => finish('canceled'),
  )
}
// Native root snapshots suppress pointer hit-testing during playback. Keep the
// inspection page resumable when its developer-only freeze control is enabled.
window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyR' && !event.repeat) {
    document.getAnimations().forEach((animation) => animation.play())
  }
})
const originalAnimate = Element.prototype.animate
Element.prototype.animate = function (frames, options) {
  const animation = originalAnimate.call(this, frames, options)
  inspection.animations.push({ frames, options })
  inspectTail(animation)
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
if (document.startViewTransition) {
  const start = document.startViewTransition.bind(document)
  document.startViewTransition = ((update: ViewTransitionUpdateCallback) => {
    const transition = start(update)
    inspection.transitions.push(transition)
    return transition
  }) as typeof document.startViewTransition
}

function Controls({
  state,
  children,
  logo,
}: {
  state: ReturnType<typeof useThemeAnimation>
  children?: React.ReactNode
  logo?: string
}) {
  const [frozen, setFrozen] = React.useState(false)
  Object.assign(window, {
    themeFixture: {
      state,
      inspection,
      preloadLogo: async () => {
        await Promise.all(
          [logo ?? config.logo, config.logoLight, config.logoDark].map(
            (asset) => (asset ? preloadThemeLogo(asset) : Promise.resolve()),
          ),
        )
      },
    },
  })
  return (
    <>
      <aside>
        <h1>Theme transitions</h1>
        <p>Origin marker and slowed playback for browser inspection.</p>
        {children}
        {params.has('probe') && (
          <>
            <p>
              {duration / 1000}s · {config.easing ?? 'default easing'} ·{' '}
              {params.get('corner')}
            </p>
            <a
              href={`/?duration=${duration}&corner=${params.get('corner') ?? 'top-right'}&probe&easing=linear`}
            >
              Compare linear timing
            </a>
            <textarea
              id='probe-output'
              readOnly
              defaultValue='Toggle once to record ending diagnostics.'
              aria-label='Ending diagnostics'
            />
          </>
        )}
        <output id='diagnostics'>
          DPR {devicePixelRatio} · {innerWidth} × {innerHeight} CSS px ·{' '}
          {state.theme} · {state.colorTheme}
        </output>
        <button
          id='freeze'
          onClick={() => {
            inspection.paused = !frozen
            setFrozen(!frozen)
          }}
        >
          Freeze {frozen ? 'on' : 'off'}
        </button>
        <button
          id='resume'
          onClick={() =>
            document.getAnimations().forEach((animation) => animation.play())
          }
        >
          Resume (R)
        </button>
      </aside>
      <main>
        <div id='transformed'>
          <button
            id='ref-toggle'
            ref={state.ref}
            onClick={() => void state.toggleTheme()}
          >
            Ref toggle
          </button>
        </div>
        <button
          id='element-toggle'
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const marker = document.getElementById('marker')!
            marker.style.left = `${rect.left + rect.width / 2}px`
            marker.style.top = `${rect.top + rect.height / 2}px`
            marker.hidden = false
            void state.toggleTheme({ element: event.currentTarget })
          }}
        >
          Element toggle
        </button>
        <button
          id='palette'
          onClick={(event) =>
            void state.switchColorTheme(
              state.colorTheme === 'ocean' ? 'rose' : 'ocean',
              { element: event.currentTarget },
            )
          }
        >
          Change palette
        </button>
        <button id='cycle' onClick={state.toggleColorTheme}>
          Cycle palette
        </button>
        <button
          id='target-palette'
          onClick={state.createColorThemeToggle('rose')}
        >
          Rose palette
        </button>
        <div className='preview'>
          <h2>A themed surface</h2>
          <p>Text and cards should stay still as the circle expands.</p>
        </div>
        {params.has('widgets') && (
          <>
            <ThemeSwitcher
              currentTheme={state.theme}
              onThemeChange={state.setTheme}
            />
            <ThemeSelector
              colorThemes={colorThemes}
              currentColorTheme={state.colorTheme}
              onColorThemeChange={(value) => {
                inspection.callbacks.push(`selector:${value}`)
                state.setColorTheme(value)
              }}
            />
          </>
        )}
        <div className='tiles'>
          {Array.from({ length: 80 }, (_, i) => (
            <article key={i}>Card {i + 1}</article>
          ))}
        </div>
      </main>
      <div id='marker' hidden />
    </>
  )
}

function HookControls() {
  const [options, setOptions] = React.useState(config)
  const state = useThemeAnimation(options)
  const asset = React.useRef<string | null>(null)
  React.useEffect(
    () => () => {
      if (asset.current) URL.revokeObjectURL(asset.current)
    },
    [],
  )
  return (
    <Controls state={state} logo={options.logo}>
      {params.has('gallery') && (
        <div className='effect-options'>
          <label>
            Effect
            <select
              aria-label='Effect'
              value={options.animationType}
              onChange={(event) =>
                setOptions({
                  ...options,
                  animationType: event.target.value as ThemeAnimationType,
                })
              }
            >
              {Object.values(ThemeAnimationType).map((effect) => (
                <option key={effect} value={effect}>
                  {effect}
                </option>
              ))}
            </select>
          </label>
          <label>
            Direction
            <select
              value={options.clipPathDirection}
              onChange={(event) =>
                setOptions({
                  ...options,
                  clipPathDirection: event.target.value as TransitionDirection,
                })
              }
            >
              {TRANSITION_DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </label>
          <label>
            Origin
            <select
              value={options.animationPosition ?? 'trigger'}
              onChange={(event) =>
                setOptions({
                  ...options,
                  animationPosition: event.target.value as AnimationPosition,
                })
              }
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
              Logo width
              <input
                type='text'
                inputMode='numeric'
                placeholder='Auto'
                value={options.logoWidth ?? ''}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    logoWidth: dimension(event.target.value),
                  })
                }
              />
            </label>
            <label>
              Logo height
              <input
                type='text'
                inputMode='numeric'
                placeholder='Auto'
                value={options.logoHeight ?? ''}
                onChange={(event) =>
                  setOptions({
                    ...options,
                    logoHeight: dimension(event.target.value),
                  })
                }
              />
            </label>
          </div>
          <label>
            SVG logo
            <input
              type='file'
              accept='image/svg+xml,.svg'
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                if (asset.current) URL.revokeObjectURL(asset.current)
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
          <p>
            Upload a logo, then click Element toggle or Change palette. R
            resumes frozen playback.
          </p>
        </div>
      )}
    </Controls>
  )
}
function UIControls() {
  return <Controls state={useSpacemanTheme()} />
}
function NextControls() {
  return <Controls state={useNextTheme()} />
}
function ViteControls() {
  return <Controls state={useViteTheme()} />
}
function TanStackControls() {
  return <Controls state={useTanStackTheme()} />
}
const callbacks = {
  onServerThemeChange: (theme: string) => {
    inspection.callbacks.push(theme)
  },
  onServerColorThemeChange: (theme: string) => {
    inspection.callbacks.push(theme)
  },
}
const app =
  provider === 'ui' ? (
    <SpacemanThemeProvider {...config}>
      <UIControls />
    </SpacemanThemeProvider>
  ) : provider === 'next' ? (
    <NextThemeProvider {...config}>
      <NextControls />
    </NextThemeProvider>
  ) : provider === 'vite' ? (
    <ViteThemeProvider {...config}>
      <ViteControls />
    </ViteThemeProvider>
  ) : provider === 'tanstack' ? (
    <TanStackThemeProvider {...config} {...callbacks}>
      <TanStackControls />
    </TanStackThemeProvider>
  ) : (
    <HookControls />
  )
createRoot(document.getElementById('root')!).render(app)
