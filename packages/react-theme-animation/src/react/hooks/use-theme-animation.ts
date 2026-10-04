import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { getThemeLogoOptions, preloadThemeLogo } from '../../core/logo'
import { runThemeTransition } from '../../core/transitions'
import type {
  AnimationConfig,
  ColorThemeToggle,
  Theme,
  ThemeTransitionInput,
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
} from '../../core/types'
import { ThemeAnimationType } from '../../core/types'
import {
  getAnimationPosition,
  getSlideFromCoords,
  getSystemTheme,
  injectBaseStyles,
  resolveTheme,
} from '../../core/utils/animations'
import { getColorTransitionOptions } from './transition-options'
import { useHydrated } from './use-hydrated'

const isBrowser = 'window' in globalThis

const defaultThemes = ['light', 'dark', 'system'] as const

const defaultColorThemes = ['default'] as const

export const useThemeAnimation = (
  props: Readonly<UseThemeAnimationProps> = {},
): UseThemeAnimationReturn => {
  const {
    duration: propsDuration = 400,
    easing = 'cubic-bezier(0.32, 0.72, 0, 1)',
    animationType = ThemeAnimationType.CIRCLE,
    blurAmount = 2,
    styleId = 'spaceman-theme-style',
    clipPathDirection = 'top-left',
    animationPosition,
    logo,
    logoLight,
    logoDark,
    logoWidth,
    logoHeight,
    gradientWidth,

    themes = defaultThemes,
    colorThemes = defaultColorThemes,
    defaultTheme = 'system',
    defaultColorTheme = 'default',

    globalClassName = 'dark',
    colorThemePrefix = 'theme-',
    attribute = 'class',
    value,
    enableColorScheme = true,

    storageKey = 'theme',
    colorStorageKey = 'color-theme',

    theme: externalTheme,
    colorTheme: externalColorTheme,

    onThemeChange,
    onColorThemeChange,

    initialTheme,
    initialColorTheme,
    systemThemeMode = 'js',

    // Slide animation options
    slideDirection = 'left',
    slideFromX,
    slideFromY,
    slideToX = 0,
    slideToY = 0,
  } = props

  // Validate untyped JavaScript callers as well as the public TypeScript union.
  getThemeLogoOptions({ logo, logoLight, logoDark })

  const duration = propsDuration

  useEffect(() => {
    if (animationType !== ThemeAnimationType.SVG_LOGO) return

    for (const asset of [logo, logoLight, logoDark]) {
      if (asset !== undefined && asset !== '') void preloadThemeLogo(asset)
    }
  }, [animationType, logo, logoLight, logoDark])

  const mounted = useHydrated()

  // Inject base styles once on mount
  useEffect(() => {
    injectBaseStyles()
  }, [])

  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    if (initialTheme !== undefined) return initialTheme

    if (!isBrowser) return defaultTheme
    const saved = localStorage.getItem(storageKey)

    return saved !== null &&
      (saved === 'light' || saved === 'dark' || saved === 'system') &&
      themes.includes(saved)
      ? saved
      : defaultTheme
  })

  const [internalColorTheme, setInternalColorTheme] = useState(() => {
    if (initialColorTheme !== undefined) return initialColorTheme

    if (!isBrowser) return defaultColorTheme
    const saved = localStorage.getItem(colorStorageKey)

    return saved !== null && saved !== '' && colorThemes.includes(saved)
      ? saved
      : defaultColorTheme
  })

  const currentTheme = externalTheme ?? internalTheme
  const currentColorTheme = externalColorTheme ?? internalColorTheme

  const [, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme())
  const systemTheme = getSystemTheme()
  const resolvedTheme = resolveTheme(currentTheme)

  useEffect(() => {
    if (!isBrowser) return undefined

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (): void => {
      setSystemTheme(getSystemTheme())
    }

    mediaQuery.addEventListener('change', handleChange)

    return (): void => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Apply theme classes to DOM
  useEffect(() => {
    if (!isBrowser || !mounted) return

    const element = document.documentElement

    const lightValue = value?.light
    const darkValue = value?.dark ?? globalClassName
    const systemValue = value?.system ?? 'system'

    if (attribute === 'data-theme') {
      if (systemThemeMode === 'css' && currentTheme === 'system') {
        element.setAttribute('data-theme', systemValue)
      } else {
        element.setAttribute(
          'data-theme',
          resolvedTheme === 'dark' ? darkValue : (lightValue ?? 'light'),
        )
      }
    } else {
      if (lightValue !== undefined && lightValue !== '') {
        element.classList.remove(lightValue)
      }

      element.classList.remove(darkValue, systemValue, 'auto')

      if (systemThemeMode === 'css' && currentTheme === 'system') {
        element.classList.add(systemValue)
      } else if (resolvedTheme === 'dark') {
        element.classList.add(darkValue)
      } else if (lightValue !== undefined && lightValue !== '') {
        element.classList.add(lightValue)
      } else {
        element.classList.remove(darkValue)
      }
    }

    if (enableColorScheme) {
      element.style.colorScheme =
        systemThemeMode === 'css' && currentTheme === 'system'
          ? ''
          : resolvedTheme
    } else {
      element.style.removeProperty('color-scheme')
    }

    colorThemes.forEach((theme) => {
      element.classList.remove(`${colorThemePrefix}${theme}`)
    })
    element.classList.add(`${colorThemePrefix}${currentColorTheme}`)
  }, [
    resolvedTheme,
    currentTheme,
    currentColorTheme,
    globalClassName,
    colorThemePrefix,
    colorThemes,
    attribute,
    value,
    enableColorScheme,
    mounted,
    systemThemeMode,
  ])

  const ref = useRef<HTMLButtonElement>(null)
  const requestedTheme = useRef(currentTheme)
  const requestedColorTheme = useRef(currentColorTheme)
  const pendingUpdates = useRef(0)
  useEffect(() => {
    if (pendingUpdates.current === 0) {
      requestedTheme.current = currentTheme
      requestedColorTheme.current = currentColorTheme
    }
  }, [currentTheme, currentColorTheme])

  const commitTheme = useCallback(
    (newTheme: Theme) => {
      // Always save to localStorage
      if (isBrowser) {
        localStorage.setItem(storageKey, newTheme)
      }

      // Update internal state if no external control
      if (externalTheme === undefined) {
        setInternalTheme(newTheme)
      }

      // Call external callback if provided
      if (onThemeChange) {
        onThemeChange(newTheme)
      }
    },
    [onThemeChange, externalTheme, storageKey],
  )

  const commitColorTheme = useCallback(
    (newColorTheme: string) => {
      // Always save to localStorage
      if (isBrowser) {
        localStorage.setItem(colorStorageKey, newColorTheme)
      }

      // Update internal state if no external control
      if (externalColorTheme === undefined) {
        setInternalColorTheme(newColorTheme)
      }

      // Call external callback if provided
      if (onColorThemeChange) {
        onColorThemeChange(newColorTheme)
      }
    },
    [onColorThemeChange, externalColorTheme, colorStorageKey],
  )

  const setTheme = useCallback(
    (newTheme: Theme) => {
      requestedTheme.current = newTheme
      commitTheme(newTheme)
    },
    [commitTheme],
  )

  const setColorTheme = useCallback(
    (newColorTheme: string) => {
      requestedColorTheme.current = newColorTheme
      commitColorTheme(newColorTheme)
    },
    [commitColorTheme],
  )

  const animateChange = useCallback(
    async (update: () => void, input: ThemeTransitionInput = false) => {
      const options =
        input === true || input === false ? { animationOff: input } : input

      let config: AnimationConfig | null = null

      if (options.animationOff !== true && duration > 0) {
        if (animationType === ThemeAnimationType.SLIDE) {
          const from =
            slideFromX !== undefined && slideFromY !== undefined
              ? { a: slideFromX, b: slideFromY }
              : getSlideFromCoords(slideDirection)

          config = {
            ...from,
            x: slideToX,
            y: slideToY,
            duration,
            easing,
            animationType,
            blurAmount,
            styleId,
          }
        } else {
          // Read before the first await. A menu may unmount its trigger, and a
          // responsive/moving layout may change during capture. All units are CSS px.
          const element = options.element ?? ref.current
          const rect = options.origin ? null : element?.getBoundingClientRect()

          const origin =
            (animationType === ThemeAnimationType.SVG_LOGO
              ? getAnimationPosition('center')
              : null) ??
            options.origin ??
            (animationPosition && animationPosition !== 'trigger'
              ? getAnimationPosition(animationPosition)
              : null) ??
            (rect
              ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
              : animationType === ThemeAnimationType.CIRCLE ||
                  animationType === ThemeAnimationType.BLUR_CIRCLE
                ? null
                : getAnimationPosition('center'))

          if (
            origin &&
            Number.isFinite(origin.x) &&
            Number.isFinite(origin.y)
          ) {
            config = {
              ...origin,
              duration,
              easing,
              animationType,
              blurAmount,
              styleId,
              clipPathDirection,
              animationPosition,
              logo:
                logoLight !== undefined
                  ? resolveTheme(requestedTheme.current) === 'light'
                    ? logoLight
                    : logoDark
                  : logo,
              logoWidth,
              logoHeight,
              gradientWidth,
            }
          }
        }
      }

      pendingUpdates.current++

      try {
        await runThemeTransition(() => {
          flushSync(update)
        }, config)
        pendingUpdates.current--
      } catch (error) {
        pendingUpdates.current--
        throw error
      }
    },
    [
      duration,
      easing,
      animationType,
      blurAmount,
      styleId,
      slideDirection,
      slideFromX,
      slideFromY,
      slideToX,
      slideToY,
      clipPathDirection,
      animationPosition,
      logo,
      logoLight,
      logoDark,
      logoWidth,
      logoHeight,
      gradientWidth,
    ],
  )

  const switchTheme = useCallback(
    async (newTheme: Theme, options?: ThemeTransitionInput) => {
      if (newTheme === requestedTheme.current) return
      requestedTheme.current = newTheme
      await animateChange(() => {
        commitTheme(newTheme)
      }, options)
    },
    [animateChange, commitTheme],
  )

  const switchColorTheme = useCallback(
    async (newColorTheme: string, options?: ThemeTransitionInput) => {
      if (!colorThemes.includes(newColorTheme)) {
        console.warn(
          `Color theme "${newColorTheme}" not found in available themes`,
        )

        return
      }

      if (newColorTheme === requestedColorTheme.current) return
      requestedColorTheme.current = newColorTheme
      await animateChange(() => {
        commitColorTheme(newColorTheme)
      }, options)
    },
    [colorThemes, animateChange, commitColorTheme],
  )

  const toggleTheme = useCallback(
    async (options?: ThemeTransitionInput) => {
      await switchTheme(
        resolveTheme(requestedTheme.current) === 'dark' ? 'light' : 'dark',
        options,
      )
    },
    [switchTheme],
  )

  const toggleLightTheme = useCallback(
    async (options?: ThemeTransitionInput) => {
      if (resolveTheme(requestedTheme.current) === 'light') return
      await switchTheme('light', options)
    },
    [switchTheme],
  )

  const toggleDarkTheme = useCallback(
    async (options?: ThemeTransitionInput) => {
      if (resolveTheme(requestedTheme.current) === 'dark') return
      await switchTheme('dark', options)
    },
    [switchTheme],
  )

  const toggleColorTheme = useCallback(
    async (input?: Parameters<ColorThemeToggle>[0]) => {
      if (colorThemes.length === 0) return
      const index = colorThemes.indexOf(requestedColorTheme.current)
      await switchColorTheme(
        colorThemes[(index + 1) % colorThemes.length],
        getColorTransitionOptions(input),
      )
    },
    [colorThemes, switchColorTheme],
  )

  const createColorThemeToggle = useCallback(
    (target: string): ColorThemeToggle => {
      return async (input) => {
        return switchColorTheme(target, getColorTransitionOptions(input))
      }
    },
    [switchColorTheme],
  )

  const isColorThemeActive = useCallback(
    (targetColorTheme: string) => {
      return currentColorTheme === targetColorTheme
    },
    [currentColorTheme],
  )

  return useMemo(
    () => ({
      ref,
      theme: currentTheme,
      colorTheme: currentColorTheme,
      resolvedTheme,
      systemTheme,
      setTheme,
      setColorTheme,
      switchTheme,
      switchColorTheme,
      toggleTheme,
      toggleLightTheme,
      toggleDarkTheme,
      toggleColorTheme,
      createColorThemeToggle,
      isColorThemeActive,
    }),
    [
      ref,
      currentTheme,
      currentColorTheme,
      resolvedTheme,
      systemTheme,
      setTheme,
      setColorTheme,
      switchTheme,
      switchColorTheme,
      toggleTheme,
      toggleLightTheme,
      toggleDarkTheme,
      toggleColorTheme,
      createColorThemeToggle,
      isColorThemeActive,
    ],
  )
}
