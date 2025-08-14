import React from 'react'
import { ThemeSelectorProps, ColorTheme } from '../types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { useSpacemanTheme } from './SpacemanThemeProvider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  currentColorTheme,
  onColorThemeChange,
  animationType,
  duration,
}) => {
  // Try to use SpacemanTheme context if available (controlled mode)
  let contextTheme: any = null
  try {
    contextTheme = useSpacemanTheme()
  } catch {
    // Context not available, use standalone mode
  }

  // Use context if available, otherwise fall back to standalone hook
  const standaloneHook = useThemeAnimation({
    animationType,
    duration,
    themes,
    colorThemes,
    ...(currentColorTheme !== undefined && { colorTheme: currentColorTheme }),
    onColorThemeChange,
  })

  const isControlled = contextTheme !== null
  const { colorTheme, setColorTheme } = isControlled
    ? { colorTheme: contextTheme.colorTheme, setColorTheme: contextTheme.setColorTheme }
    : standaloneHook

  const handleColorThemeChange = (newColorTheme: string) => {
    setColorTheme(newColorTheme as ColorTheme)
    // Also call the callback if provided
    if (onColorThemeChange) {
      onColorThemeChange(newColorTheme as ColorTheme)
    }
  }

  return (
    <>
      {colorThemes.length > 1 && (
        <div className="flex flex-col gap-2">
          <Select value={colorTheme} onValueChange={(v: string) => handleColorThemeChange(v)}>
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
      )}
    </>
  )
}
