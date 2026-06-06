import React from 'react'
import { ThemeSelectorProps, ColorTheme } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  SharedThemeContextValue,
  useSharedThemeContext,
} from './shared-theme-context'

interface ThemeSelectorViewProps {
  colorTheme: ColorTheme
  colorThemes: ColorTheme[]
  onSelectColorTheme: (colorTheme: ColorTheme) => void
}

const ThemeSelectorView: React.FC<ThemeSelectorViewProps> = ({
  colorTheme,
  colorThemes,
  onSelectColorTheme,
}) => {
  return (
    <>
      {colorThemes.length > 1 ? (
        <div className="flex flex-col gap-2">
          <Select
            value={colorTheme}
            onValueChange={value => onSelectColorTheme(value as ColorTheme)}
          >
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Choose a color theme" />
            </SelectTrigger>
            <SelectContent>
              {colorThemes.map(theme => (
                <SelectItem key={theme} className="capitalize" value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
    </>
  )
}

const ThemeSelectorWithContext: React.FC<
  Pick<ThemeSelectorProps, 'colorThemes'> & {
    contextTheme: SharedThemeContextValue
  }
> = ({ colorThemes = ['default'], contextTheme }) => {
  return (
    <ThemeSelectorView
      colorTheme={contextTheme.colorTheme}
      colorThemes={colorThemes}
      onSelectColorTheme={contextTheme.setColorTheme}
    />
  )
}

const ThemeSelectorStandalone: React.FC<ThemeSelectorProps> = ({
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  currentColorTheme,
  onColorThemeChange,
  animationType,
  duration,
}) => {
  const standaloneHook = useThemeAnimation({
    animationType,
    duration,
    themes,
    colorThemes,
    ...(currentColorTheme !== undefined && { colorTheme: currentColorTheme }),
    onColorThemeChange,
  })

  return (
    <ThemeSelectorView
      colorTheme={standaloneHook.colorTheme}
      colorThemes={colorThemes}
      onSelectColorTheme={standaloneHook.setColorTheme}
    />
  )
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = props => {
  const contextTheme = useSharedThemeContext()

  if (contextTheme) {
    return <ThemeSelectorWithContext {...props} contextTheme={contextTheme} />
  }

  return <ThemeSelectorStandalone {...props} />
}
