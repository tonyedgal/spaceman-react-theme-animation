import React from 'react'

import type { Theme, ThemeSwitcherProps } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { defaultThemes } from './ThemeSwitcher.shared'
import { ThemeSwitcherView } from './ThemeSwitcher.ThemeSwitcherView'

export function ThemeSwitcherStandalone({
  themes = defaultThemes,
  currentTheme,
  onThemeChange,
  animationType,
  duration,
  className,
}: ThemeSwitcherProps): React.JSX.Element {
  const standaloneHook = useThemeAnimation({
    animationType,
    duration,
    themes,
    ...(currentTheme !== undefined && { theme: currentTheme }),
    onThemeChange,
  })

  const handleSwitchTheme = async (theme: Theme): Promise<void> => {
    await standaloneHook.switchTheme(theme)
  }

  return (
    <ThemeSwitcherView
      className={className}
      onSwitchTheme={handleSwitchTheme}
      theme={standaloneHook.theme}
      themes={themes}
      themeRef={standaloneHook.ref}
    />
  )
}
