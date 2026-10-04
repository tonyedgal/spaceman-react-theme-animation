import React from 'react'

import type { Theme } from '@space-man/react-theme-animation'

import { MonitorIcon } from './ThemeSwitcher.MonitorIcon'
import { MoonIcon } from './ThemeSwitcher.MoonIcon'
import { SunIcon } from './ThemeSwitcher.SunIcon'

export const defaultThemes = ['light', 'dark', 'system'] as const

export const THEME_OPTIONS = [
  {
    icon: React.createElement(MonitorIcon),
    value: 'system',
  },
  {
    icon: React.createElement(SunIcon),
    value: 'light',
  },
  {
    icon: React.createElement(MoonIcon),
    value: 'dark',
  },
] satisfies { readonly icon: React.JSX.Element; readonly value: Theme }[]
