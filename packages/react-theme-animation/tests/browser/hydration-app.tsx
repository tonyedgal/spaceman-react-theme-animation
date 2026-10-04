import React from 'react'

import { useThemeAnimation } from '@space-man/react-theme-animation/react'

const colorThemes = ['default', 'ocean'] as const

export function HydrationApp(): React.JSX.Element {
  const state = useThemeAnimation({ defaultTheme: 'system', colorThemes })

  return React.createElement(
    'output',
    null,
    [
      state.theme,
      state.colorTheme,
      state.resolvedTheme,
      state.systemTheme,
    ].join(':'),
  )
}
