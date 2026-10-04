'use client'

import { motion } from 'motion/react'
import React, { type JSX } from 'react'

import { cn } from '@/lib/utils'
import type { Theme } from '@space-man/react-theme-animation'

export function ThemeOption({
  icon,
  value,
  isActive,
  onClick,
}: Readonly<{
  readonly icon: JSX.Element
  readonly value: Theme
  readonly isActive?: boolean
  readonly onClick: (value: Theme) => void
}>): React.JSX.Element {
  return (
    <button
      type='button'
      className={cn(
        'relative flex size-8 cursor-default items-center justify-center rounded-full transition-all [&_svg]:size-4',
        isActive === true
          ? 'text-zinc-950 dark:text-zinc-50'
          : 'text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50',
      )}
      aria-pressed={isActive === true}
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
