import { Moon, Sun } from 'lucide-react'
import * as React from 'react'

import {
  type SlideDirection,
  ThemeAnimationType,
  useThemeAnimation,
} from '@space-man/react-theme-animation'

import { Button } from '../ui/button'

const copy = {
  toggleTheme: 'Toggle theme',
}

export function SlideThemeToggle({
  slideDirection = 'left',
}: {
  slideDirection?: SlideDirection
}): React.JSX.Element {
  const { ref, toggleTheme } = useThemeAnimation({
    duration: 1000,
    animationType: ThemeAnimationType.SLIDE,
    slideDirection,
  })

  return (
    <div className='z-50 flex h-12 w-12 cursor-pointer items-center justify-center'>
      <Button
        variant='outline'
        size='icon'
        ref={ref}
        onClick={() => {
          void toggleTheme().catch(console.error)
        }}
      >
        <Sun className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
        <Moon className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
        <span className='sr-only'>{copy.toggleTheme}</span>
      </Button>
    </div>
  )
}
