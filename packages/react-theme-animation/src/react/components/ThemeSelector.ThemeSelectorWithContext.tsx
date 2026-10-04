import React from 'react'

import type { ThemeSelectorProps } from '../../core/types'
import type { SharedThemeContextValue } from './shared-theme-context'
import { defaultColorThemes } from './ThemeSelector.shared'
import { ThemeSelectorView } from './ThemeSelector.ThemeSelectorView'

export function ThemeSelectorWithContext({
  className,
  placeholder,
  colorThemeLabel,
  onColorThemeChange,
  colorThemes = defaultColorThemes,
  contextTheme,
}: Readonly<
  Pick<
    ThemeSelectorProps,
    | 'colorThemes'
    | 'className'
    | 'placeholder'
    | 'colorThemeLabel'
    | 'onColorThemeChange'
  > & {
    readonly contextTheme: SharedThemeContextValue
  }
>): React.JSX.Element {
  const handleColorThemeChange = async (
    value: string,
    options?: Parameters<typeof contextTheme.switchColorTheme>[1],
  ): Promise<void> => {
    if (value === contextTheme.colorTheme) return
    await contextTheme.switchColorTheme(value, options)
    onColorThemeChange?.(value)
  }

  return (
    <ThemeSelectorView
      className={className}
      placeholder={placeholder}
      colorThemeLabel={colorThemeLabel}
      colorTheme={contextTheme.colorTheme}
      colorThemes={colorThemes}
      onSelectColorTheme={handleColorThemeChange}
    />
  )
}
