import React, { type JSX, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { clsx } from 'clsx'
import { ThemeSwitcherProps, Theme } from '../../core/types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import {
  SharedThemeContextValue,
  useSharedThemeContext,
} from './shared-theme-context'

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const MonitorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
)

const ThemeOption = ({
  icon,
  value,
  isActive,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  buttonRef,
}: {
  icon: JSX.Element
  value: string
  isActive?: boolean
  isHovered?: boolean
  onClick: (value: string, event?: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  buttonRef?: React.RefObject<HTMLButtonElement | null>
}) => {
  return (
    <button
      ref={
        isActive ? (buttonRef as React.RefObject<HTMLButtonElement>) : undefined
      }
      className={clsx(
        'relative flex h-9 w-12 cursor-pointer items-center justify-center',
        'text-muted-foreground hover:text-foreground',
        isActive && 'text-foreground font-medium'
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={event => onClick(value, event)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        borderRadius: 'var(--radius)',
      }}
    >
      {isHovered && (
        <motion.div
          layoutId="theme-hover"
          className="absolute inset-0 bg-muted"
          style={{
            borderRadius: 'var(--radius)',
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            stiffness: 100,
            damping: 10,
            duration: 0.3,
          }}
        />
      )}

      <div className="relative z-10 flex items-center justify-center">
        <div className="[&_svg]:size-4">{icon}</div>
      </div>

      {isActive && (
        <div
          className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
          style={{
            backgroundColor: 'hsl(var(--primary))',
          }}
        />
      )}
    </button>
  )
}

const THEME_OPTIONS = [
  {
    icon: <MonitorIcon />,
    value: 'system',
  },
  {
    icon: <SunIcon />,
    value: 'light',
  },
  {
    icon: <MoonIcon />,
    value: 'dark',
  },
]

interface ThemeSwitcherViewProps {
  className?: string
  onSwitchTheme: (
    theme: Theme,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void>
  theme: Theme
  themes: Theme[]
  themeRef?: React.RefObject<HTMLButtonElement | null>
}

const ThemeSwitcherView: React.FC<ThemeSwitcherViewProps> = ({
  className,
  onSwitchTheme,
  theme,
  themes,
  themeRef,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleThemeChange = async (
    newTheme: string,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    await onSwitchTheme(newTheme as Theme, event)
  }

  const filteredOptions = THEME_OPTIONS.filter(option =>
    themes.includes(option.value as Theme)
  )

  return (
    <div
      className={clsx(
        'inline-flex h-9 items-center overflow-hidden bg-background shadow-sm border border-border',
        isMounted ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        borderRadius: 'var(--radius)',
        backgroundColor: 'hsl(var(--background))',
      }}
      role="radiogroup"
      onMouseLeave={() => setHoveredTheme(null)}
    >
      {filteredOptions.map(option => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          isHovered={hoveredTheme === option.value}
          onClick={handleThemeChange}
          onMouseEnter={() => setHoveredTheme(option.value)}
          onMouseLeave={() => {}}
          buttonRef={theme === option.value ? themeRef : undefined}
        />
      ))}
    </div>
  )
}

const ThemeSwitcherWithContext: React.FC<
  Pick<ThemeSwitcherProps, 'className' | 'themes'> & {
    contextTheme: SharedThemeContextValue
  }
> = ({ className, contextTheme, themes = ['light', 'dark', 'system'] }) => {
  const handleSwitchTheme = async (
    theme: Theme,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (contextTheme.switchThemeFromElement && event) {
      await contextTheme.switchThemeFromElement(theme, event.currentTarget)
      return
    }

    await contextTheme.switchTheme(theme)
  }

  return (
    <ThemeSwitcherView
      className={className}
      onSwitchTheme={handleSwitchTheme}
      theme={contextTheme.theme}
      themes={themes}
      themeRef={contextTheme.ref}
    />
  )
}

const ThemeSwitcherStandalone: React.FC<ThemeSwitcherProps> = ({
  themes = ['light', 'dark', 'system'],
  currentTheme,
  onThemeChange,
  animationType,
  duration,
  className,
}) => {
  const standaloneHook = useThemeAnimation({
    animationType,
    duration,
    themes,
    ...(currentTheme !== undefined && { theme: currentTheme }),
    onThemeChange,
  })

  const handleSwitchTheme = async (theme: Theme) => {
    await standaloneHook.switchTheme(theme)
  }

  return (
    <ThemeSwitcherView
      className={className}
      onSwitchTheme={handleSwitchTheme}
      theme={standaloneHook.theme}
      themes={themes}
      themeRef={standaloneHook.ref}
    />
  )
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = props => {
  const contextTheme = useSharedThemeContext()

  if (contextTheme) {
    return <ThemeSwitcherWithContext {...props} contextTheme={contextTheme} />
  }

  return <ThemeSwitcherStandalone {...props} />
}
