import React from 'react'

import type { Theme, ThemeSwitcherProps } from '../../core/types'
import type { SharedThemeContextValue } from './shared-theme-context'
import { defaultThemes } from './ThemeSwitcher.shared'
import { ThemeSwitcherView } from './ThemeSwitcher.ThemeSwitcherView'

export function ThemeSwitcherWithContext({
  className,
  contextTheme,
  themes = defaultThemes,
}: Pick<ThemeSwitcherProps, 'className' | 'themes'> & {
  contextTheme: SharedThemeContextValue
}): React.JSX.Element {
  const handleSwitchTheme = async (
    theme: Theme,
    event?: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    if (contextTheme.switchThemeFromElement && event) {
      await contextTheme.switchThemeFromElement(theme, event.currentTarget)

      return
    }

    await contextTheme.switchTheme(theme)
  }

  return (
    <ThemeSwitcherView
      className={className}
      onSwitchTheme={handleSwitchTheme}
      theme={contextTheme.theme}
      themes={themes}
      themeRef={contextTheme.ref}
    />
  )
}
