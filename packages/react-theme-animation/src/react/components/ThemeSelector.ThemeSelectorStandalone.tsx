import React from 'react'

import type { ThemeSelectorProps } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { defaultColorThemes, defaultThemes } from './ThemeSelector.shared'
import { ThemeSelectorView } from './ThemeSelector.ThemeSelectorView'

export function ThemeSelectorStandalone({
  className,
  placeholder,
  colorThemeLabel,
  themes = defaultThemes,
  colorThemes = defaultColorThemes,
  currentColorTheme,
  onColorThemeChange,
  animationType,
  duration,
  ...animationOptions
}: ThemeSelectorProps): React.JSX.Element {
  const standaloneHook = useThemeAnimation({
    ...animationOptions,
    animationType,
    duration,
    themes,
    colorThemes,
    ...(currentColorTheme !== undefined && { colorTheme: currentColorTheme }),
    onColorThemeChange,
  })

  const handleColorThemeChange = standaloneHook.switchColorTheme

  return (
    <ThemeSelectorView
      className={className}
      placeholder={placeholder}
      colorThemeLabel={colorThemeLabel}
      colorTheme={standaloneHook.colorTheme}
      colorThemes={colorThemes}
      onSelectColorTheme={handleColorThemeChange}
    />
  )
}
