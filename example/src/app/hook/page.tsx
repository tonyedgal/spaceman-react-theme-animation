'use client'

import { BlurThemeToggle } from '@/components/theme/BlurThemeToggle'
import { SlideThemeToggle } from '@/components/theme/SlideThemeToggle'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { SlideDirection, Theme, ThemeAnimationType } from '@/types'
import { useThemeAnimation } from '@/hooks/useThemeAnimation'

export default function Home() {
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('left')

  const isBrowser = typeof window !== 'undefined'

  const localStoreTheme = (): Theme => {
    if (!isBrowser) return 'light'
    try {
      const savedTheme = localStorage.getItem('theme') as Theme
      return savedTheme
    } catch (error) {
      console.error('Error accessing localStorage:', error)
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }

  const [theme, setTheme] = useState<Theme>(() => localStoreTheme())

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme
    setTheme(savedTheme === 'dark' ? 'dark' : savedTheme === 'system' ? 'system' : 'light')
  }, [])

  const { ref, toggleDarkTheme, toggleLightTheme } = useThemeAnimation({
    duration: 2000,
    animationType: ThemeAnimationType.CIRCLE,
  })

  return (
    <main className="min-h-screen bg-transparent w-full flex items-center justify-center relative">
      {/* Slide Direction Selector */}

      <section className="flex items-center justify-center gap-6 p-6 rounded-lg border border-border bg-background">
        <div className="flex gap-2 items-center justify-center">
          <label className="text-sm font-medium">Circle Theme:</label>
          <ThemeToggle />
        </div>
        <div className="flex gap-2 items-center justify-center">
          <label className="text-sm font-medium">Blur Circle Theme:</label>
          <BlurThemeToggle />
        </div>
        <div className="flex gap-2 items-center justify-center">
          <label className="text-sm font-medium">Slide Theme:</label>
          <SlideThemeToggle slideDirection={slideDirection} />
        </div>
        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
          <label className="text-sm font-medium">Slide direction:</label>
          <Select
            value={slideDirection}
            onValueChange={v => setSlideDirection(v as SlideDirection)}
          >
            <SelectTrigger size="sm" className="w-36">
              <SelectValue>{slideDirection}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="top">Top</SelectItem>
              <SelectItem value="bottom">Bottom</SelectItem>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 p-2 bg-background rounded-md">
          <label className="text-sm font-medium">Theme:</label>
          <Select
            value={theme}
            onValueChange={value => {
              const newTheme = value as Theme
              setTheme(newTheme)
              localStorage.setItem('theme', newTheme)
              if (newTheme === 'dark') {
                toggleDarkTheme()
              } else if (newTheme === 'light') {
                toggleLightTheme()
              } else if (newTheme === 'system') {
                window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? toggleDarkTheme()
                  : toggleLightTheme()
              }
            }}
          >
            <SelectTrigger size="sm" className="w-36" ref={ref}>
              <SelectValue>{theme}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>
    </main>
  )
}
