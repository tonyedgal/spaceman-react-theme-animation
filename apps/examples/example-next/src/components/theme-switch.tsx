'use client'

import React, { type JSX, useEffect, useState } from 'react'
import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { type Theme, useTheme } from '@space-man/react-theme-animation'

import { cn } from '@/lib/utils'

const ThemeOption = ({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element
  value: Theme
  isActive?: boolean
  onClick: (value: Theme) => void
}) => {
  return (
    <button
      className={cn(
        'relative flex size-8 cursor-default items-center justify-center rounded-full transition-all [&_svg]:size-4',
        isActive
          ? 'text-zinc-950 dark:text-zinc-50'
          : 'text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50'
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => onClick(value)}
    >
      {icon}

      {isActive && (
        <motion.div
          layoutId="theme-option"
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"
        />
      )}
    </button>
  )
}

const THEME_OPTIONS = [
  {
    icon: <MonitorIcon />,
    value: 'system' as Theme,
  },
  {
    icon: <SunIcon />,
    value: 'light' as Theme,
  },
  {
    icon: <MoonStarIcon />,
    value: 'dark' as Theme,
  },
]

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="flex h-8 w-24" />
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700"
      role="radiogroup"
    >
      {THEME_OPTIONS.map(option => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={value => setTheme(value as Theme)}
        />
      ))}
    </motion.div>
  )
}

export { ThemeSwitch }
