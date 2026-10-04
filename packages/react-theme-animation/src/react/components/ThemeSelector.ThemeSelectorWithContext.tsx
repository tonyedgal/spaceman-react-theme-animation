import React from 'react'

import type { ThemeSelectorProps } from '../../core/types'
import type { SharedThemeContextValue } from './shared-theme-context'
import { defaultColorThemes } from './ThemeSelector.shared'
import { ThemeSelectorView } from './ThemeSelector.ThemeSelectorView'

export function ThemeSelectorWithContext({
  colorThemes = defaultColorThemes,
  contextTheme,
}: Pick<ThemeSelectorProps, 'colorThemes'> & {
  contextTheme: SharedThemeContextValue
}): React.JSX.Element {
  const handleColorThemeChange = contextTheme.setColorTheme

  return (
    <ThemeSelectorView
      colorTheme={contextTheme.colorTheme}
      colorThemes={colorThemes}
      onSelectColorTheme={handleColorThemeChange}
    />
  )
}
