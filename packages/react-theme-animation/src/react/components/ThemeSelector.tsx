import React, { useRef } from 'react'

import type {
  ThemeSelectorProps,
  ColorTheme,
  ThemeTransitionInput,
} from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import type { SharedThemeContextValue } from './shared-theme-context'
import { useSharedThemeContext } from './shared-theme-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface ThemeSelectorViewProps {
  colorTheme: ColorTheme
  colorThemes: ColorTheme[]
  onSelectColorTheme: (
    colorTheme: ColorTheme,
    options?: ThemeTransitionInput,
  ) => Promise<void>
}

const ThemeSelectorView: React.FC<ThemeSelectorViewProps> = ({
  colorTheme,
  colorThemes,
  onSelectColorTheme,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const keyboard = useRef(false)
  const handleColorChange = (color: string) => {
    void onSelectColorTheme(color, {
      element: triggerRef.current,
      animationOff: keyboard.current,
    })
  }
  return (
    <>
      {colorThemes.length > 1 ? (
        <div
          className='flex flex-col gap-2'
          onKeyDownCapture={() => {
            keyboard.current = true
          }}
          onPointerDownCapture={() => {
            keyboard.current = false
          }}
        >
          <Select value={colorTheme} onValueChange={handleColorChange}>
            <SelectTrigger ref={triggerRef} className='capitalize'>
              <SelectValue placeholder='Choose a color theme' />
            </SelectTrigger>
            <SelectContent>
              {colorThemes.map((theme) => (
                <SelectItem key={theme} className='capitalize' value={theme}>
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
      onSelectColorTheme={contextTheme.switchColorTheme}
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
  ...animationOptions
}) => {
  const standaloneHook = useThemeAnimation({
    ...animationOptions,
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
      onSelectColorTheme={standaloneHook.switchColorTheme}
    />
  )
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = (props) => {
  const contextTheme = useSharedThemeContext()

  if (contextTheme) {
    return <ThemeSelectorWithContext {...props} contextTheme={contextTheme} />
  }

  return <ThemeSelectorStandalone {...props} />
}
