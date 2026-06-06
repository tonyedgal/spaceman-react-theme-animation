import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/button'
import { useThemeAnimation } from '../../hooks/useThemeAnimation'
import { ThemeAnimationType, SlideDirection } from '../../types'

export function SlideThemeToggle({ slideDirection = 'left' }: { slideDirection?: SlideDirection }) {
  const { ref, toggleTheme } = useThemeAnimation({
    duration: 1000,
    animationType: ThemeAnimationType.SLIDE,
    slideDirection,
  })

  return (
    <div className="z-50 h-12 w-12 flex justify-center items-center cursor-pointer">
      <Button variant="outline" size="icon" ref={ref} onClick={() => toggleTheme()}>
        <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
