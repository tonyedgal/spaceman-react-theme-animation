'use client'

import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react'
import { motion } from 'motion/react'
import React, { type JSX } from 'react'

import { cn } from '@/lib/utils'
import { type Theme, useTheme } from '@space-man/react-theme-animation'
import { useHydrated } from '@space-man/react-theme-animation/react'

function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: {
  icon: JSX.Element
  value: Theme
  isActive?: boolean
  onClick: (value: Theme) => void
}): React.JSX.Element {
  return (
    <button
      type='button'
      className={cn(
        'relative flex size-8 cursor-default items-center justify-center rounded-full transition-all [&_svg]:size-4',
        isActive === true
          ? 'text-zinc-950 dark:text-zinc-50'
          : 'text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50',
      )}
      role='radio'
      aria-checked={isActive}
      aria-label={`Switch to ${value} theme`}
      onClick={() => {
        onClick(value)
      }}
    >
      {icon}

      {isActive === true && (
        <motion.div
          layoutId='theme-option'
          transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
          className='absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700'
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
    icon: <MoonStarIcon />,
    value: 'dark',
  },
] satisfies { readonly icon: React.JSX.Element; readonly value: Theme }[]

function ThemeSwitch(): React.JSX.Element {
  const { theme, setTheme } = useTheme()

  const isMounted = useHydrated()

  if (!isMounted) {
    return <div className='flex h-8 w-24' />
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700'
      role='radiogroup'
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          isActive={theme === option.value}
          onClick={(value) => {
            setTheme(value)
          }}
        />
      ))}
    </motion.div>
  )
}

export { ThemeSwitch }
