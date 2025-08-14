import React, { type JSX, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { clsx } from 'clsx'
import { ThemeSwitcherProps, Theme } from '../types'
import { useThemeAnimation } from '../hooks/use-theme-animation'
import { useSpacemanTheme } from './SpacemanThemeProvider'

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
      ref={isActive ? (buttonRef as React.RefObject<HTMLButtonElement>) : undefined}
      className={clsx(
        'relative flex h-9 w-12 cursor-pointer items-center justify-center transition-all duration-200 ease-in-out',
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
      {/* Hover background */}
      {isHovered && (
        <motion.div
          layoutId="theme-hover-bg"
          className="absolute inset-0 bg-muted backdrop-blur-sm"
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

      {/* Icon with scaling animation */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.4,
        }}
      >
        <div className="[&_svg]:size-4">{icon}</div>
      </motion.div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="theme-active-indicator"
          className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
          style={{
            backgroundColor: 'hsl(var(--primary))',
          }}
          transition={{
            type: 'spring',
            bounce: 0.3,
            duration: 0.6,
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

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  themes = ['light', 'dark', 'system'],
  currentTheme,
  onThemeChange,
  animationType,
  duration,
  className,
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
    ...(currentTheme !== undefined && { theme: currentTheme }),
    onThemeChange,
  })

  const isControlled = contextTheme !== null
  const { ref, theme, switchTheme } = isControlled
    ? { ref: contextTheme.ref, theme: contextTheme.theme, switchTheme: contextTheme.switchTheme }
    : standaloneHook

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleThemeChange = async (
    newTheme: string,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isControlled && contextTheme.switchThemeFromElement && event) {
      // Use controlled mode with animation from clicked element
      await contextTheme.switchThemeFromElement(newTheme as Theme, event.currentTarget)
      // Also call the callback if provided
      if (onThemeChange) {
        onThemeChange(newTheme as Theme)
      }
    } else {
      // Use standalone mode
      await switchTheme(newTheme as Theme)
    }
  }

  if (!isMounted) {
    return <div className="flex h-9 w-fit" />
  }

  const filteredOptions = THEME_OPTIONS.filter(option => themes.includes(option.value as Theme))

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'inline-flex items-center overflow-hidden bg-background shadow-sm border border-border',
        'transition-all duration-200 ease-in-out',
        className
      )}
      style={{
        borderRadius: 'var(--radius)',
        backgroundColor: 'hsl(var(--background))',
      }}
      role="radiogroup"
    >
      {filteredOptions.map(option => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          isHovered={false}
          onClick={handleThemeChange}
          onMouseEnter={() => {}}
          onMouseLeave={() => {}}
          buttonRef={theme === option.value ? ref : undefined}
        />
      ))}
    </motion.div>
  )
}
