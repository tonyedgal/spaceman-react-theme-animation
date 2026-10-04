import { clsx } from 'clsx'
import React, { useState } from 'react'

import type { Theme } from '../../core/types'
import { useHydrated } from '../hooks/use-hydrated'
import type { ThemeSwitcherViewProps } from './ThemeSwitcher.shared'
import { THEME_OPTIONS } from './ThemeSwitcher.shared'
import { ThemeOption } from './ThemeSwitcher.ThemeOption'

export function ThemeSwitcherView({
  className,
  onSwitchTheme,
  theme,
  themes,
  themeRef,
}: ThemeSwitcherViewProps): React.JSX.Element {
  const isMounted = useHydrated()
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  const handleThemeChange = async (
    newTheme: Theme,
    event?: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    await onSwitchTheme(newTheme, event)
  }

  const filteredOptions = THEME_OPTIONS.filter((option) =>
    themes.includes(option.value),
  )

  return (
    <fieldset
      className={clsx(
        'bg-background border-border m-0 inline-flex h-9 min-w-0 items-center overflow-hidden border p-0 shadow-sm',
        isMounted ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{
        borderRadius: 'var(--radius)',
        backgroundColor: 'hsl(var(--background))',
      }}
      aria-label='Theme'
    >
      {filteredOptions.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          isHovered={hoveredTheme === option.value}
          onClick={(value, event) => {
            void handleThemeChange(value, event).catch(console.error)
          }}
          onMouseEnter={() => {
            setHoveredTheme(option.value)
          }}
          onMouseLeave={() => {
            setHoveredTheme(null)
          }}
          buttonRef={theme === option.value ? themeRef : undefined}
        />
      ))}
    </fieldset>
  )
}
