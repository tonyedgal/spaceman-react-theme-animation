import React from 'react'

import type { ThemeSelectorViewProps } from './ThemeSelector.shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export function ThemeSelectorView({
  colorTheme,
  colorThemes,
  onSelectColorTheme,
}: ThemeSelectorViewProps): React.JSX.Element | null {
  return colorThemes.length > 1 ? (
    <div className='flex flex-col gap-2'>
      <Select
        value={colorTheme}
        onValueChange={(value) => {
          onSelectColorTheme(value)
        }}
      >
        <SelectTrigger className='capitalize'>
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
  ) : null
}
