'use client'

import { motion } from 'motion/react'
import React from 'react'

import { useTheme } from '@space-man/react-theme-animation'
import { useHydrated } from '@space-man/react-theme-animation/react'

import { THEME_OPTIONS } from './theme-switch-options'
import { ThemeOption } from './theme-switch.ThemeOption'

export function ThemeSwitch(): React.JSX.Element {
  const { theme, setTheme } = useTheme()

  const isMounted = useHydrated()

  if (!isMounted) {
    return <div className='flex h-8 w-24' />
  }

  return (
    <motion.fieldset
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='m-0 inline-flex min-w-0 items-center overflow-hidden rounded-full border-0 bg-white p-0 ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700'
      aria-label='Theme'
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
    </motion.fieldset>
  )
}
