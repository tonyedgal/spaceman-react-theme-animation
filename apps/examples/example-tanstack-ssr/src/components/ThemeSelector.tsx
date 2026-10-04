'use client'

import React from 'react'

import type { ThemeSelectorProps } from '@space-man/react-theme-animation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const defaultColorThemes = ['default', 'mono', 'supabase'] as const

export function ThemeSelector({
  colorThemes = defaultColorThemes,
  currentColorTheme,
  onColorThemeChange,
}: Readonly<ThemeSelectorProps>): React.JSX.Element | null {
  // Use controlled props instead of internal hook
  const colorTheme =
    currentColorTheme === undefined || currentColorTheme === ''
      ? 'default'
      : currentColorTheme

  const handleColorThemeChange = (newColorTheme: string): void => {
    if (onColorThemeChange) {
      onColorThemeChange(newColorTheme)
    }
  }

  if (colorThemes.length <= 1) return null

  return (
    <div className='flex flex-col gap-2'>
      <Select
        value={colorTheme}
        onValueChange={(v: string) => {
          handleColorThemeChange(v)
        }}
      >
        <SelectTrigger className='capitalize'>
          <SelectValue placeholder='Choose a color theme' />
        </SelectTrigger>
        <SelectContent>
          {colorThemes.map((theme) => (
            <SelectItem key={theme} className='capitalize' value={theme}>
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
