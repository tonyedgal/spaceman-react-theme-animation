import React, { useId, useRef } from 'react'

import type { ThemeSelectorViewProps } from './ThemeSelector.shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export function ThemeSelectorView({
  className,
  placeholder = 'Choose a color theme',
  colorThemeLabel,
  colorTheme,
  colorThemes,
  onSelectColorTheme,
}: ThemeSelectorViewProps): React.JSX.Element | null {
  const triggerId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputMethod = useRef<'keyboard' | 'pointer'>('keyboard')

  return colorThemes.length > 1 ? (
    <div
      className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}
    >
      {colorThemeLabel !== undefined && colorThemeLabel !== '' ? (
        <label htmlFor={triggerId}>{colorThemeLabel}</label>
      ) : null}
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
          id={triggerId}
          ref={triggerRef}
          onPointerDownCapture={() => {
            inputMethod.current = 'pointer'
          }}
          onKeyDownCapture={() => {
            inputMethod.current = 'keyboard'
          }}
          className='capitalize'
        >
          <SelectValue placeholder={placeholder} />
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
