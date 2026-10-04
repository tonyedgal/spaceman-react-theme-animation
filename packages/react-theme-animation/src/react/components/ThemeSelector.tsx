import React from 'react'

import type { ThemeSelectorProps } from '../../core/types'
import { useSharedThemeContext } from './shared-theme-context'
import { ThemeSelectorStandalone } from './ThemeSelector.ThemeSelectorStandalone'
import { ThemeSelectorWithContext } from './ThemeSelector.ThemeSelectorWithContext'

export function ThemeSelector(props: ThemeSelectorProps): React.JSX.Element {
  const contextTheme = useSharedThemeContext()

  if (contextTheme) {
    return <ThemeSelectorWithContext {...props} contextTheme={contextTheme} />
  }

  return <ThemeSelectorStandalone {...props} />
}
