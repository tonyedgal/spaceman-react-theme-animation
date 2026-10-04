'use client'

import React, { useState } from 'react'

import { BlurThemeToggle } from '@/components/theme/BlurThemeToggle'
import { SlideThemeToggle } from '@/components/theme/SlideThemeToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  type SlideDirection,
  type Theme,
  ThemeAnimationType,
  useThemeAnimation,
} from '@space-man/react-theme-animation'

const copy = {
  circleTheme: 'Circle Theme:',
  blurCircleTheme: 'Blur Circle Theme:',
  slideTheme: 'Slide Theme:',
  slideDirection: 'Slide direction:',
  left: 'Left',
  right: 'Right',
  top: 'Top',
  bottom: 'Bottom',
  topLeft: 'Top Left',
  topRight: 'Top Right',
  bottomLeft: 'Bottom Left',
  bottomRight: 'Bottom Right',
  theme: 'Theme:',
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export default function Home(): React.JSX.Element {
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('left')

  const isBrowser = 'window' in globalThis

  const localStoreTheme = (): Theme => {
    if (!isBrowser) return 'light'

    try {
      const savedTheme = localStorage.getItem('theme')

      return savedTheme === 'dark' || savedTheme === 'system'
        ? savedTheme
        : 'light'
    } catch (error) {
      console.error('Error accessing localStorage:', error)

      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
  }

  const [theme, setTheme] = useState<Theme>(() => localStoreTheme())

  const { ref, toggleDarkTheme, toggleLightTheme } = useThemeAnimation({
    duration: 2000,
    animationType: ThemeAnimationType.CIRCLE,
  })

  return (
    <main className='relative flex min-h-screen w-full items-center justify-center bg-transparent'>
      {/* Slide Direction Selector */}

      <section className='border-border bg-background flex items-center justify-center gap-6 rounded-lg border p-6'>
        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm font-medium'>{copy.circleTheme}</span>
          <ThemeToggle />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm font-medium'>{copy.blurCircleTheme}</span>
          <BlurThemeToggle />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <span className='text-sm font-medium'>{copy.slideTheme}</span>
          <SlideThemeToggle slideDirection={slideDirection} />
        </div>
        <div className='bg-background flex items-center gap-2 rounded-md p-2'>
          <span className='text-sm font-medium'>{copy.slideDirection}</span>
          <Select
            value={slideDirection}
            onValueChange={(v) => {
              if (
                v === 'left' ||
                v === 'right' ||
                v === 'top' ||
                v === 'bottom' ||
                v === 'top-left' ||
                v === 'top-right' ||
                v === 'bottom-left' ||
                v === 'bottom-right'
              )
                setSlideDirection(v)
            }}
          >
            <SelectTrigger size='sm' className='w-36'>
              <SelectValue>{slideDirection}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='left'>{copy.left}</SelectItem>
              <SelectItem value='right'>{copy.right}</SelectItem>
              <SelectItem value='top'>{copy.top}</SelectItem>
              <SelectItem value='bottom'>{copy.bottom}</SelectItem>
              <SelectItem value='top-left'>{copy.topLeft}</SelectItem>
              <SelectItem value='top-right'>{copy.topRight}</SelectItem>
              <SelectItem value='bottom-left'>{copy.bottomLeft}</SelectItem>
              <SelectItem value='bottom-right'>{copy.bottomRight}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='bg-background flex items-center gap-2 rounded-md p-2'>
          <span className='text-sm font-medium'>{copy.theme}</span>
          <Select
            value={theme}
            onValueChange={(value) => {
              if (value !== 'light' && value !== 'dark' && value !== 'system')
                return
              const newTheme = value
              setTheme(newTheme)
              localStorage.setItem('theme', newTheme)

              if (newTheme === 'dark') {
                void toggleDarkTheme().catch(console.error)
              } else if (newTheme === 'light') {
                void toggleLightTheme().catch(console.error)
              } else {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  void toggleDarkTheme()
                } else {
                  void toggleLightTheme()
                }
              }
            }}
          >
            <SelectTrigger size='sm' className='w-36' ref={ref}>
              <SelectValue>{theme}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='light'>{copy.light}</SelectItem>
              <SelectItem value='dark'>{copy.dark}</SelectItem>
              <SelectItem value='system'>{copy.system}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </main>
  )
}
