import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import React from 'react'

import type { Theme } from '@space-man/react-theme-animation'

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
    icon: React.createElement(MoonStarIcon),
    value: 'dark',
  },
] satisfies { readonly icon: React.JSX.Element; readonly value: Theme }[]
