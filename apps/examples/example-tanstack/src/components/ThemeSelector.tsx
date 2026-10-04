'use client'

import React from 'react'

import type { ThemeSelectorProps } from '@space-man/react-theme-animation'
import { ThemeSelector as SpacemanThemeSelector } from '@space-man/react-theme-animation'

const defaultColorThemes = ['default', 'mono', 'supabase'] as const

export function ThemeSelector({
  colorThemes = defaultColorThemes,
  ...props
}: Readonly<ThemeSelectorProps>): React.JSX.Element {
  return <SpacemanThemeSelector {...props} colorThemes={colorThemes} />
}
