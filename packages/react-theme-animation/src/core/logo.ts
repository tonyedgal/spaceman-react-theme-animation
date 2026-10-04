import type { ThemeLogoOptions } from './types'

interface ThemeLogoInput {
  logo?: string
  logoLight?: string
  logoDark?: string
}

/** Validate the asset configuration and preserve its required-pair type. */
export const getThemeLogoOptions = (
  input: ThemeLogoInput,
): ThemeLogoOptions => {
  if (input.logoLight !== undefined || input.logoDark !== undefined) {
    if (!input.logoLight || !input.logoDark) {
      throw new Error('logoLight and logoDark must both be provided.')
    }

    if (input.logo !== undefined) {
      throw new Error('Use logo or the logoLight/logoDark pair, not both.')
    }

    return { logoLight: input.logoLight, logoDark: input.logoDark }
  }

  return { logo: input.logo }
}

interface LoadedLogo {
  image: string
  aspectRatio: number
  naturalWidth: number
}

interface LogoCacheEntry {
  ready?: LoadedLogo
  loading: Promise<void>
}

export interface TransitionLogo {
  element: HTMLImageElement
  style: HTMLStyleElement
}

let logoSequence = 0

/** Extract a fixed logo into a separate snapshot, above the page reveal. */
export const mountTransitionLogo = (
  config: import('./types').AnimationConfig,
): TransitionLogo | undefined => {
  const logo = getLoadedThemeLogo(config.logo)

  if (!logo) return

  const validWidth =
    config.logoWidth !== 'auto' &&
    config.logoWidth &&
    Number.isFinite(config.logoWidth) &&
    config.logoWidth > 0
      ? config.logoWidth
      : undefined

  const validHeight =
    config.logoHeight !== 'auto' &&
    config.logoHeight &&
    Number.isFinite(config.logoHeight) &&
    config.logoHeight > 0
      ? config.logoHeight
      : undefined

  const width =
    validWidth ??
    (validHeight
      ? validHeight * logo.aspectRatio
      : config.logoWidth === 'auto' || config.logoHeight === 'auto'
        ? logo.naturalWidth
        : 96)

  const height = validHeight ?? width / logo.aspectRatio
  const name = `spaceman-theme-logo-${++logoSequence}`
  const element = document.createElement('img')
  element.src = logo.image
  element.alt = ''
  element.setAttribute('aria-hidden', 'true')
  element.setAttribute('data-spaceman-theme-logo', '')
  element.style.cssText = `position:fixed;left:calc(50% - ${width / 2}px);top:calc(50% - ${height / 2}px);width:${width}px;height:${height}px;max-width:none;max-height:none;object-fit:contain;display:block;margin:0;padding:0;border:0;transform:none;pointer-events:none;z-index:2147483647;view-transition-name:${name};`
  const style = document.createElement('style')
  style.setAttribute('data-spaceman-theme-logo-style', '')
  style.textContent = `
    @keyframes ${name}-fade { 0%, 85% { opacity:1; } 100% { opacity:0; } }
    html[data-spaceman-theme-transition]::view-transition-group(${name}) {
      z-index:2;
      animation:${name}-fade ${config.duration}ms linear both;
    }
    html[data-spaceman-theme-transition]::view-transition-old(${name}) { display:none; }
    html[data-spaceman-theme-transition]::view-transition-new(${name}) {
      animation:none; mix-blend-mode:normal;
    }
  `
  document.head.appendChild(style)
  document.documentElement.appendChild(element)

  return { element, style }
}

const logos = new Map<string, LogoCacheEntry>()

/** Decode SVG assets before capture. A pending/failed asset never delays a toggle. */
export const preloadThemeLogo = (url: string): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve()
  const existing = logos.get(url)

  if (existing) return existing.loading

  const entry: LogoCacheEntry = {
    loading: Promise.resolve(),
  }

  logos.set(url, entry)
  entry.loading = (async () => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2000)

    try {
      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) return
      const text = await response.text()
      const svg = new DOMParser().parseFromString(text, 'image/svg+xml')

      if (
        svg.querySelector('parsererror') ||
        svg.documentElement.localName !== 'svg' ||
        svg.documentElement.namespaceURI !== 'http://www.w3.org/2000/svg'
      )
        return
      // This is an image resource, never inserted into the page as SVG markup.
      const image = `data:image/svg+xml,${encodeURIComponent(text)}`
      const decoded = new Image()
      decoded.src = image
      await decoded.decode()

      if (decoded.naturalWidth > 0 && decoded.naturalHeight > 0) {
        entry.ready = {
          image,
          naturalWidth: decoded.naturalWidth,
          aspectRatio: decoded.naturalWidth / decoded.naturalHeight,
        }
      }
    } catch {
      // Missing, non-SVG, CORS-blocked, or undecodable logos use the circle fallback.
    } finally {
      clearTimeout(timeout)
    }
  })()

  return entry.loading
}

export const getLoadedThemeLogo = (url?: string): LoadedLogo | undefined =>
  url ? logos.get(url)?.ready : undefined
