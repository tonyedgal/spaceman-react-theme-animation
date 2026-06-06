'use client'

import * as React from 'react'
import { ThemeProvider as SpacemanThemeProvider } from '@space-man/react-theme-animation'

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof SpacemanThemeProvider>) {
  return (
    <SpacemanThemeProvider
      {...props}
      attribute="class"
      colorThemes={[
        'default',
        'blue',
        'green',
        'purple',
        'caffeine',
        'mono',
        'supabase',
      ]}
    >
      {children}
    </SpacemanThemeProvider>
  )
}
