import React, { useRef } from 'react'

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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputMethod = useRef<'keyboard' | 'pointer'>('keyboard')

  return colorThemes.length > 1 ? (
    <div className='flex flex-col gap-2'>
      <Select
        value={colorTheme}
        onValueChange={(value) => {
          void onSelectColorTheme(value, {
            element: triggerRef.current,
            animationOff: inputMethod.current === 'keyboard',
          }).catch(console.error)
        }}
      >
        <SelectTrigger
          ref={triggerRef}
          onPointerDownCapture={() => {
            inputMethod.current = 'pointer'
          }}
          onKeyDownCapture={() => {
            inputMethod.current = 'keyboard'
          }}
          className='capitalize'
        >
          <SelectValue placeholder='Choose a color theme' />
        </SelectTrigger>
        <SelectContent
          onPointerDownCapture={() => {
            inputMethod.current = 'pointer'
          }}
          onKeyDownCapture={() => {
            inputMethod.current = 'keyboard'
          }}
        >
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
