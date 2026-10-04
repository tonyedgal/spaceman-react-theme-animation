import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

import { useThemeAnimation } from '@space-man/react-theme-animation'

import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

const copy = {
  supabase: 'Supabase',
  mono: 'Mono',
}

export const Route = createFileRoute('/cards')({ component: CardsPage })

export function CardsPage(): React.JSX.Element {
  const { createColorThemeToggle, isColorThemeActive } = useThemeAnimation({
    colorThemes: ['default', 'supabase', 'mono', 'caffeine'],
  })

  return (
    <main className='relative flex min-h-screen w-full items-center justify-center bg-transparent'>
      <div className='bg-background/80 grid grid-cols-1 gap-10 rounded-lg border p-8 md:grid-cols-2'>
        <Button
          onClick={(event) => {
            void createColorThemeToggle('supabase')(event).catch(console.error)
          }}
          variant='default'
          className={cn(
            'bg-primary text-primary-foreground',
            `${isColorThemeActive('supabase') ? 'ring-2 ring-blue-500 ring-offset-2' : ''} `,
          )}
        >
          {copy.supabase}
        </Button>
        <Button
          onClick={(event) => {
            void createColorThemeToggle('mono')(event).catch(console.error)
          }}
          variant='secondary'
          className={cn(
            'bg-secondary text-secondary-foreground',
            `${isColorThemeActive('mono') ? 'ring-2 ring-blue-500 ring-offset-2' : ''} `,
          )}
        >
          {copy.mono}
        </Button>
      </div>
    </main>
  )
}
