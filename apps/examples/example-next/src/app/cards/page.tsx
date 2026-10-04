'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useThemeAnimation } from '@space-man/react-theme-animation'

const Page = () => {
  const { createColorThemeToggle, isColorThemeActive } = useThemeAnimation({
    colorThemes: ['default', 'supabase', 'mono', 'caffeine'],
  })

  return (
    <main className='relative flex min-h-screen w-full items-center justify-center bg-transparent'>
      <div className='bg-background/80 grid grid-cols-1 gap-10 rounded-lg border p-8 md:grid-cols-2'>
        <Button
          onClick={createColorThemeToggle('supabase')}
          variant={'default'}
          className={cn(
            'bg-primary text-primary-foreground',
            `${isColorThemeActive('supabase') ? 'ring-2 ring-blue-500 ring-offset-2' : ''} `,
          )}
        >
          Supabase
        </Button>
        <Button
          onClick={createColorThemeToggle('mono')}
          variant={'secondary'}
          className={cn(
            'bg-secondary text-secondary-foreground',
            `${isColorThemeActive('mono') ? 'ring-2 ring-blue-500 ring-offset-2' : ''} `,
          )}
        >
          Mono
        </Button>
      </div>
    </main>
  )
}

export default Page
