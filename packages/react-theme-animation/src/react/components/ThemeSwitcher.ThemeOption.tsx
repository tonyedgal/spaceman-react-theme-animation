import { clsx } from 'clsx'
import { motion } from 'motion/react'
import React, { type JSX } from 'react'

import type { Theme } from '../../core/types'

export function ThemeOption({
  icon,
  value,
  isActive,
  isHovered,
  onClick,
  onMouseEnter,
  onMouseLeave,
  buttonRef,
}: Readonly<{
  readonly icon: JSX.Element
  readonly value: Theme
  readonly isActive?: boolean
  readonly isHovered?: boolean
  readonly onClick: (
    value: Theme,
    event?: React.MouseEvent<HTMLButtonElement>,
  ) => void
  readonly onMouseEnter: () => void
  readonly onMouseLeave: () => void
  readonly buttonRef?: React.RefObject<HTMLButtonElement | null>
}>): React.JSX.Element {
  return (
    <button
      type='button'
      ref={isActive === true ? buttonRef : undefined}
      className={clsx(
        'relative flex h-9 w-12 cursor-pointer items-center justify-center',
        'text-muted-foreground hover:text-foreground',
        isActive === true && 'text-foreground font-medium',
      )}
      aria-pressed={isActive === true}
      aria-label={`Switch to ${value} theme`}
      onClick={(event) => {
        onClick(value, event)
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        borderRadius: 'var(--radius)',
      }}
    >
      {isHovered === true && (
        <motion.div
          layoutId='theme-hover'
          className='bg-muted absolute inset-0'
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

      <div className='relative z-10 flex items-center justify-center'>
        <div className='[&_svg]:size-4'>{icon}</div>
      </div>

      {isActive === true && (
        <div
          className='absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full'
          style={{
            backgroundColor: 'hsl(var(--primary))',
          }}
        />
      )}
    </button>
  )
}
