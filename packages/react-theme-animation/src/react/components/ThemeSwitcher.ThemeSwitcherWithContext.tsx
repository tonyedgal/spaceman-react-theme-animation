import React from 'react'

import type { Theme, ThemeSwitcherProps } from '../../core/types'
import type { SharedThemeContextValue } from './shared-theme-context'
import { defaultThemes } from './ThemeSwitcher.shared'
import { ThemeSwitcherView } from './ThemeSwitcher.ThemeSwitcherView'

export function ThemeSwitcherWithContext({
  className,
  contextTheme,
  themes = defaultThemes,
}: Readonly<
  Pick<ThemeSwitcherProps, 'className' | 'themes'> & {
    readonly contextTheme: SharedThemeContextValue
  }
>): React.JSX.Element {
  const handleSwitchTheme = async (
    theme: Theme,
    event?: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    if (event?.detail === 0) {
      await contextTheme.switchTheme(theme, true)

      return
    }

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
