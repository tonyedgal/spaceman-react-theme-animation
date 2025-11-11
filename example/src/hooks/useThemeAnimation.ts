import { useEffect, useRef, useState, useCallback } from 'react'
import { flushSync } from 'react-dom'
import {
  UseThemeAnimationProps,
  UseThemeAnimationReturn,
  ThemeAnimationType,
  Theme,
} from '../types'
import {
  injectBaseStyles,
  resolveTheme,
  getSystemTheme,
  supportsViewTransitions,
  prefersReducedMotion,
  createCircleAnimation,
  createBlurCircleAnimation,
  createSlideAnimation,
} from '../utils/animations'

const isBrowser = typeof window !== 'undefined'

export const useThemeAnimation = (props: UseThemeAnimationProps = {}): UseThemeAnimationReturn => {
  const {
    duration: propsDuration = 750,
    easing = 'ease-in-out',
    animationType = ThemeAnimationType.CIRCLE,
    blurAmount = 2,
    styleId = 'spaceman-theme-style',

    themes = ['light', 'dark', 'system'],
    colorThemes = ['default'],
    defaultTheme = 'system',
    defaultColorTheme = 'default',

    globalClassName = 'dark',
    colorThemePrefix = 'theme-',

    storageKey = 'theme',
    colorStorageKey = 'color-theme',

    theme: externalTheme,
    colorTheme: externalColorTheme,

    onThemeChange,
    onColorThemeChange,

    // Slide animation options
    slideDirection = 'left',
    slideFromX,
    slideFromY,
    slideToX = 0,
    slideToY = 0,
  } = props

  const isHighResolution = isBrowser && (window.innerWidth >= 3000 || window.innerHeight >= 2000)
  const duration = isHighResolution ? Math.max(propsDuration * 0.8, 500) : propsDuration

  const [mounted, setMounted] = useState(false)

  // Inject base styles once on mount
  useEffect(() => {
    injectBaseStyles()
    setMounted(true)
  }, [])

  const [internalTheme, setInternalTheme] = useState<Theme>(() => {
    if (!isBrowser) return defaultTheme
    const saved = localStorage.getItem(storageKey) as Theme | null
    return saved && themes.indexOf(saved) !== -1 ? saved : defaultTheme
  })

  const [internalColorTheme, setInternalColorTheme] = useState(() => {
    if (!isBrowser) return defaultColorTheme
    const saved = localStorage.getItem(colorStorageKey)
    return saved && colorThemes.indexOf(saved) !== -1 ? saved : defaultColorTheme
  })

  const currentTheme = externalTheme ?? internalTheme
  const currentColorTheme = externalColorTheme ?? internalColorTheme

  const [, setSystemTheme] = useState<'light' | 'dark'>(() => getSystemTheme())
  const resolvedTheme = resolveTheme(currentTheme)

  useEffect(() => {
    if (!isBrowser) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemTheme(getSystemTheme())

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Apply theme classes to DOM
  useEffect(() => {
    if (!isBrowser || !mounted) return

    if (resolvedTheme === 'dark') {
      document.documentElement.classList.add(globalClassName)
    } else {
      document.documentElement.classList.remove(globalClassName)
    }

    colorThemes.forEach(theme => {
      document.documentElement.classList.remove(`${colorThemePrefix}${theme}`)
    })
    document.documentElement.classList.add(`${colorThemePrefix}${currentColorTheme}`)
  }, [resolvedTheme, currentColorTheme, globalClassName, colorThemePrefix, colorThemes, mounted])

  const ref = useRef<HTMLButtonElement>(null)

  const setTheme = useCallback(
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
    [onThemeChange, externalTheme, storageKey]
  )

  const setColorTheme = useCallback(
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
    [onColorThemeChange, externalColorTheme, colorStorageKey]
  )

  const switchTheme = useCallback(
    async (newTheme: Theme) => {
      if (!ref.current || !supportsViewTransitions() || prefersReducedMotion()) {
        setTheme(newTheme)
        return
      }

      // Helper function to convert direction to from coordinates
      const getSlideFromCoords = (direction: string) => {
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

      let animationConfig

      if (animationType === ThemeAnimationType.SLIDE) {
        // Use custom coordinates if provided, otherwise use direction
        const fromCoords =
          slideFromX !== undefined && slideFromY !== undefined
            ? { a: slideFromX, b: slideFromY }
            : getSlideFromCoords(slideDirection)

        animationConfig = {
          a: fromCoords.a,
          b: fromCoords.b,
          x: slideToX,
          y: slideToY,
          duration,
          easing,
          animationType,
          blurAmount,
          styleId,
        }
      } else {
        // For circle and blur circle animations, use button center
        const { top, left, width, height } = ref.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2

        animationConfig = {
          x,
          y,
          duration,
          easing,
          animationType,
          blurAmount,
          styleId,
        }
      }

      if (animationType === ThemeAnimationType.BLUR_CIRCLE) {
        createBlurCircleAnimation(animationConfig)
      }

      if (animationType === ThemeAnimationType.SLIDE) {
        createSlideAnimation(animationConfig)
      }

      // Start the view transition

      await (document as Document).startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme)
        })
      }).ready

      if (animationType === ThemeAnimationType.CIRCLE) {
        createCircleAnimation(animationConfig)
      }
    },
    [
      setTheme,
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
    ]
  )

  const switchColorTheme = useCallback(
    (newColorTheme: string) => {
      if (colorThemes.indexOf(newColorTheme) === -1) {
        console.warn(`Color theme "${newColorTheme}" not found in available themes`)
        return
      }
      setColorTheme(newColorTheme)
    },
    [colorThemes, setColorTheme]
  )

  const toggleTheme = useCallback(async () => {
    const newTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'
    await switchTheme(newTheme)
  }, [resolvedTheme, switchTheme])

  const toggleLightTheme = useCallback(async () => {
    if (resolvedTheme === 'light') return

    await switchTheme('light')
  }, [resolvedTheme, switchTheme])

  const toggleDarkTheme = useCallback(async () => {
    if (resolvedTheme === 'dark') return

    await switchTheme('dark')
  }, [resolvedTheme, switchTheme])

  const toggleColorTheme = useCallback(() => {
    const currentIndex = colorThemes.indexOf(currentColorTheme)
    const nextIndex = (currentIndex + 1) % colorThemes.length
    const nextColorTheme = colorThemes[nextIndex]
    setColorTheme(nextColorTheme)
  }, [currentColorTheme, colorThemes, setColorTheme])

  const createColorThemeToggle = useCallback(
    (targetColorTheme: string) => {
      return () => {
        if (colorThemes.indexOf(targetColorTheme) === -1) {
          console.warn(`Color theme "${targetColorTheme}" not found in available themes`)
          return
        }
        setColorTheme(targetColorTheme)
      }
    },
    [colorThemes, setColorTheme]
  )

  const isColorThemeActive = useCallback(
    (targetColorTheme: string) => {
      return currentColorTheme === targetColorTheme
    },
    [currentColorTheme]
  )

  return {
    ref,
    theme: currentTheme,
    colorTheme: currentColorTheme,
    resolvedTheme,
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
  }
}
