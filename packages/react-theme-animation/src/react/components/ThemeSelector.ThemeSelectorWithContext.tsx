import React from 'react'

import type { ThemeSelectorProps } from '../../core/types'
import type { SharedThemeContextValue } from './shared-theme-context'
import { defaultColorThemes } from './ThemeSelector.shared'
import { ThemeSelectorView } from './ThemeSelector.ThemeSelectorView'

export function ThemeSelectorWithContext({
  colorThemes = defaultColorThemes,
  contextTheme,
}: Readonly<
  Pick<ThemeSelectorProps, 'colorThemes'> & {
    readonly contextTheme: SharedThemeContextValue
  }
>): React.JSX.Element {
  const handleColorThemeChange = contextTheme.switchColorTheme

  return (
    <ThemeSelectorView
      colorTheme={contextTheme.colorTheme}
      colorThemes={colorThemes}
      onSelectColorTheme={handleColorThemeChange}
    />
  )
}
