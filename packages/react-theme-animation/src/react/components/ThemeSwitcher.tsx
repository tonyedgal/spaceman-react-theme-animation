import React from 'react'

import type { ThemeSwitcherProps } from '../../core/types'
import { useSharedThemeContext } from './shared-theme-context'
import { ThemeSwitcherStandalone } from './ThemeSwitcher.ThemeSwitcherStandalone'
import { ThemeSwitcherWithContext } from './ThemeSwitcher.ThemeSwitcherWithContext'

export function ThemeSwitcher(props: ThemeSwitcherProps): React.JSX.Element {
  const contextTheme = useSharedThemeContext()

  if (contextTheme) {
    return <ThemeSwitcherWithContext {...props} contextTheme={contextTheme} />
  }

  return <ThemeSwitcherStandalone {...props} />
}
