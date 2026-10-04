import type {
  AnimationConfig,
  AnimationPosition,
  SlideDirection,
  ThemeTransitionOptions,
} from '../types'

const isBrowser = typeof window !== 'undefined'

/** Injects styles scoped to transitions owned by this library. */
export const injectBaseStyles = (): void => {
  if (!isBrowser || document.getElementById('spaceman-theme-base-style')) return
  const style = document.createElement('style')
  style.id = 'spaceman-theme-base-style'
  style.textContent = `
    html[data-spaceman-theme-transition]::view-transition-group(root),
    html[data-spaceman-theme-transition]::view-transition-old(root),
    html[data-spaceman-theme-transition]::view-transition-new(root) {
      animation: none;
    }
    html[data-spaceman-theme-transition]::view-transition-old(root),
    html[data-spaceman-theme-transition]::view-transition-new(root) {
      mix-blend-mode: normal;
    }
    html[data-spaceman-theme-transition],
    html[data-spaceman-theme-transition] *,
    html[data-spaceman-theme-transition] *::before,
    html[data-spaceman-theme-transition] *::after {
      transition: none !important;
    }
  `
  document.head.appendChild(style)
}

/**
 * Creates an SVG blur circle mask for animations
 * @param blur - Blur amount for the gaussian filter
 * @returns Data URI string for the SVG mask
 */
export const createBlurCircleMask = (blur: number): string => {
  const blurFilter = `<filter id="blur"><feGaussianBlur stdDeviation="${blur}" /></filter>`
  const circleRadius = 25

  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"><defs>${blurFilter}</defs><circle cx="0" cy="0" r="${circleRadius}" fill="white" filter="url(%23blur)"/></svg>')`
}

/**
 * Gets the system theme preference
 * @returns 'light' or 'dark' based on system preference
 */
export const getSystemTheme = (): 'light' | 'dark' => {
  if (!isBrowser) return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Resolves a theme value to its actual light/dark value
 * @param theme - Theme to resolve ('light', 'dark', or 'system')
 * @returns Resolved theme ('light' or 'dark')
 */
export const resolveTheme = (theme: string): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme()
  }

  return theme === 'dark' ? 'dark' : 'light'
}

/**
 * Resolves a stored theme to the server-side class to apply on <html>.
 * CSS mode uses the 'system' class so media queries can respond before hydration.
 */
export const resolveThemeForServer = (
  theme: string,
): 'light' | 'dark' | 'system' => {
  if (theme === 'system') {
    return 'system'
  }

  return theme === 'dark' ? 'dark' : 'light'
}

/**
 * Checks if the browser supports View Transitions API
 * @returns true if view transitions are supported
 */
export const supportsViewTransitions = (): boolean => {
  return isBrowser && document.startViewTransition instanceof Function
}

/**
 * Checks if user prefers reduced motion
 * @returns true if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return (
    isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Converts a slide direction to from coordinates
 * @param direction - Slide direction
 * @returns Object with a (x) and b (y) coordinates
 */
interface SlideCoordinates {
  readonly a: number
  readonly b: number
}

export const getSlideFromCoords = (
  direction: SlideDirection,
): SlideCoordinates => {
  switch (direction) {
    case 'left':
      return { a: -100, b: 0 }
    case 'right':
      return { a: 100, b: 0 }
    case 'top':
      return { a: 0, b: -100 }
    case 'bottom':
      return { a: 0, b: 100 }
    case 'top-left':
      return { a: -100, b: -100 }
    case 'top-right':
      return { a: 100, b: -100 }
    case 'bottom-left':
      return { a: -100, b: 100 }
    case 'bottom-right':
      return { a: 100, b: 100 }
    default:
      return { a: -100, b: 0 }
  }
}

/** Cover the captured snapshot, including fractional zoom and its feather edge. */
interface SnapshotSize {
  readonly width: number
  readonly height: number
}

const getSnapshotSize = (): SnapshotSize => {
  // innerWidth/Height are integers; the captured CSS box can be fractional at
  // browser zoom. Read once after ready, and keep every coordinate in CSS px.
  const snapshot = getComputedStyle(
    document.documentElement,
    '::view-transition-new(root)',
  )

  const width = Math.max(window.innerWidth, parseFloat(snapshot.width) || 0)
  const height = Math.max(window.innerHeight, parseFloat(snapshot.height) || 0)

  return { width, height }
}

const getCircleRadius = (x: number, y: number): number => {
  const { width, height } = getSnapshotSize()

  return (
    Math.hypot(
      Math.max(Math.abs(x), Math.abs(width - x)),
      Math.max(Math.abs(y), Math.abs(height - y)),
    ) + 1
  ) // Overscan prevents an antialiased final corner from revealing the old view.
}

/** Viewport CSS coordinates for fixed origins; button origins stay in the hook. */
export const getAnimationPosition = (
  position: Exclude<AnimationPosition, 'trigger'>,
): NonNullable<ThemeTransitionOptions['origin']> => {
  const x = position.includes('left')
    ? 0
    : position.includes('right')
      ? window.innerWidth
      : window.innerWidth / 2

  const y = position.includes('top')
    ? 0
    : position.includes('bottom')
      ? window.innerHeight
      : window.innerHeight / 2

  return { x, y }
}

let revealSequence = 0

const animateReveal = (
  config: AnimationConfig,
  frames: Readonly<PropertyIndexedKeyframes>,
): Animation => {
  const animation = document.documentElement.animate(frames, {
    duration: config.duration,
    easing: config.easing,
    fill: 'both',
    pseudoElement: '::view-transition-new(root)',
  })

  const effect = animation.effect

  if (!(effect instanceof KeyframeEffect)) return animation
  const keyframes = effect.getKeyframes()

  const property = keyframes.some((frame) => 'clipPath' in frame)
    ? 'clipPath'
    : keyframes.some((frame) => 'maskImage' in frame)
      ? 'maskImage'
      : 'transform'

  const value = getComputedStyle(
    document.documentElement,
    '::view-transition-new(root)',
  )[property]

  if (value !== 'none') return animation

  // Some engines accept WAAPI pseudoElement but render no animated style. CSS
  // pseudo animations are independently supported; retain the same native clock.
  const paused = animation.playState === 'paused'
  const time = animation.currentTime
  animation.cancel()
  void animation.finished.catch(() => {})
  const name = `spaceman-theme-reveal-${++revealSequence}`
  const style = document.createElement('style')

  const rules = keyframes
    .map((frame) => {
      const declarations = Object.entries(frame)
        .filter(
          ([key]) =>
            !['offset', 'computedOffset', 'easing', 'composite'].includes(key),
        )
        .map(
          ([key, value]) =>
            `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value};`,
        )
        .join('')

      return `${frame.computedOffset * 100}%{${declarations}}`
    })
    .join('')

  style.textContent = `@keyframes ${name}{${rules}}html[data-spaceman-theme-transition]::view-transition-new(root){animation:${name} ${config.duration}ms ${config.easing} both;}`
  document.head.appendChild(style)

  // Reading the name flushes style so the native CSS animation is discoverable.
  const animationName = getComputedStyle(
    document.documentElement,
    '::view-transition-new(root)',
  ).animationName

  const fallback = document
    .getAnimations()
    .find(
      (candidate) =>
        candidate instanceof CSSAnimation &&
        candidate.animationName === animationName,
    )

  if (!fallback) {
    style.remove()
    throw new Error('Transition pseudo animations are unavailable')
  }

  if (paused) {
    fallback.pause()
    fallback.currentTime = time
  }

  void fallback.finished.then(
    () => {
      style.remove()
    },
    () => {
      style.remove()
    },
  )

  return fallback
}

/** A half-plane wipe, including diagonals, with compatible four-point polygons. */
export const createClipPathAnimation = (config: AnimationConfig): Animation => {
  const direction = config.clipPathDirection ?? 'top-left'

  const polygons: Record<SlideDirection, string> = {
    'top-left': 'polygon(-1% -1%, 101% -101%, -101% 101%, -1% -1%)',
    top: 'polygon(-1% -1%, 101% -1%, 101% -1%, -1% -1%)',
    'top-right': 'polygon(101% -1%, 201% 101%, -1% -101%, 101% -1%)',
    right: 'polygon(101% -1%, 101% 101%, 101% 101%, 101% -1%)',
    'bottom-right': 'polygon(101% 101%, -1% 201%, 201% -1%, 101% 101%)',
    bottom: 'polygon(101% 101%, -1% 101%, -1% 101%, 101% 101%)',
    'bottom-left': 'polygon(-1% 101%, -101% -1%, 101% 201%, -1% 101%)',
    left: 'polygon(-1% 101%, -1% -1%, -1% -1%, -1% 101%)',
  }

  // Expand the clipped half-plane in its travel direction. Rectangular end
  // vertices retain winding order and cover the snapshot with slight overscan.
  const ends: Record<SlideDirection, string> = {
    'top-left': 'polygon(-1% -1%, 201% -1%, -1% 201%, -1% -1%)',
    top: 'polygon(-1% -1%, 101% -1%, 101% 101%, -1% 101%)',
    'top-right': 'polygon(101% -1%, 101% 201%, -101% -1%, 101% -1%)',
    right: 'polygon(101% -1%, 101% 101%, -1% 101%, -1% -1%)',
    'bottom-right': 'polygon(101% 101%, -101% 101%, 101% -101%, 101% 101%)',
    bottom: 'polygon(101% 101%, -1% 101%, -1% -1%, 101% -1%)',
    'bottom-left': 'polygon(-1% 101%, -1% -101%, 201% 101%, -1% 101%)',
    left: 'polygon(-1% 101%, -1% -1%, 101% -1%, 101% 101%)',
  }

  return animateReveal(config, {
    clipPath: [polygons[direction], ends[direction]],
  })
}

/** Feathered polygon/edge mask, without Gaussian filtering or scaling content. */
export const createPolygonGradientAnimation = (
  config: AnimationConfig,
): Animation => {
  const direction = config.clipPathDirection ?? 'top-left'
  const { width, height } = getSnapshotSize()
  const diagonal = direction.includes('-')
  const left = direction.includes('left')
  const top = direction.includes('top')
  const horizontal = direction === 'left' || direction === 'right'
  const x = left ? 0 : direction.includes('right') ? 1 : 0.5
  const y = top ? 0 : direction.includes('bottom') ? 1 : 0.5
  const w = diagonal || horizontal ? width * 3 : width
  const h = diagonal || !horizontal ? height * 3 : height

  const points = diagonal
    ? `${x * 100},${y * 100} ${(1 - x) * 100},${y * 100} ${x * 100},${(1 - y) * 100}`
    : '0,0 100,0 100,100 0,100'

  // SVG gradient t = x/w + y/h for a diagonal. Its perpendicular CSS
  // distance is 1 / hypot(1/w, 1/h), including non-square viewports.
  const length = diagonal ? (w * h) / Math.hypot(w, h) : horizontal ? w : h

  const feather = Math.max(
    0,
    Math.min(config.gradientWidth ?? 80, length * 0.2),
  )

  const stop = 1 - feather / length
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><defs><linearGradient id="edge" x1="${x * 100}" y1="${y * 100}" x2="${100 * (diagonal ? 0.5 : horizontal ? 1 - x : x)}" y2="${100 * (diagonal ? 0.5 : horizontal ? y : 1 - y)}" gradientUnits="userSpaceOnUse"><stop offset="${stop}" stop-color="black"/><stop offset="1" stop-color="black" stop-opacity="0"/></linearGradient></defs><polygon points="${points}" fill="url(#edge)"/></svg>`

  return animateReveal(config, {
    maskImage: [
      `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
    ],
    maskMode: ['alpha', 'alpha'],
    maskRepeat: ['no-repeat', 'no-repeat'],
    maskSize: [
      diagonal ? '0px 0px' : horizontal ? `0px ${h}px` : `${w}px 0px`,
      `${w}px ${h}px`,
    ],
    maskPosition: [
      `${x * width}px ${y * height}px`,
      `${x * (width - w)}px ${y * (height - h)}px`,
    ],
  })
}

/** Upright triangle; its final incircle contains all four snapshot corners. */
export const createTriangleAnimation = (config: AnimationConfig): Animation => {
  const { x, y } = config
  const radius = getCircleRadius(x, y)
  const side = Math.sqrt(3) * radius

  return animateReveal(config, {
    clipPath: [
      `polygon(${x}px ${y}px, ${x}px ${y}px, ${x}px ${y}px)`,
      `polygon(${x}px ${y - 2 * radius}px, ${x + side}px ${y + radius}px, ${x - side}px ${y + radius}px)`,
    ],
  })
}

/** The fixed logo has its own snapshot; only the page reveal grows beneath it. */
export const createSvgLogoAnimation = (config: AnimationConfig): Animation => {
  const { width, height } = getSnapshotSize()

  return createCircleAnimation({ ...config, x: width / 2, y: height / 2 })
}

/** Native circular clip; browser compositor support varies by engine. */
export const createCircleAnimation = (config: AnimationConfig): Animation => {
  const { x, y } = config

  return animateReveal(config, {
    clipPath: [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${getCircleRadius(x, y)}px at ${x}px ${y}px)`,
    ],
  })
}

/** Predetermined translation uses WAAPI rather than a timer-owned stylesheet. */
export const createSlideAnimation = (config: AnimationConfig): Animation => {
  const { a = -100, b = 0, x, y } = config

  return animateReveal(config, {
    transform: [`translate(${a}%, ${b}%)`, `translate(${x}%, ${y}%)`],
  })
}

/**
 * A bounded radial gradient feathers only the reveal edge. Unlike the old SVG
 * Gaussian mask, it needs no huge filtered surface or animation on the old view.
 * Mask animation can still paint; this is not a compositor-only guarantee.
 */
export const createBlurCircleAnimation = (
  config: AnimationConfig,
): Animation => {
  const { x, y, blurAmount } = config

  if (blurAmount <= 0) return createCircleAnimation(config)
  const feather = Math.min(blurAmount, 20)
  const radius = getCircleRadius(x, y) + feather
  const diameter = radius * 2

  return animateReveal(config, {
    maskImage: [
      `radial-gradient(closest-side, #000 calc(100% - ${feather}px), transparent 100%)`,
      `radial-gradient(closest-side, #000 calc(100% - ${feather}px), transparent 100%)`,
    ],
    maskRepeat: ['no-repeat', 'no-repeat'],
    maskSize: ['0px 0px', `${diameter}px ${diameter}px`],
    maskPosition: [`${x}px ${y}px`, `${x - radius}px ${y - radius}px`],
  })
}
