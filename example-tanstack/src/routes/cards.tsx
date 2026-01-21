import { createFileRoute } from '@tanstack/react-router'
import { useThemeAnimation } from '../hooks/useThemeAnimation'
import { Button } from '../components/ui/button'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/cards')({ component: CardsPage })

function CardsPage() {
  const { createColorThemeToggle, isColorThemeActive } = useThemeAnimation({
    colorThemes: ['default', 'supabase', 'mono', 'caffeine'],
  })

  return (
    <main className="min-h-screen bg-transparent w-full flex items-center justify-center relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 bg-background/80 border rounded-lg">
        <Button
          onClick={createColorThemeToggle('supabase')}
          variant={'default'}
          className={cn(
            'bg-primary text-primary-foreground',
            `${isColorThemeActive('supabase') ? 'ring-2 ring-offset-2 ring-blue-500' : ''} `
          )}
        >
          Supabase
        </Button>
        <Button
          onClick={createColorThemeToggle('mono')}
          variant={'secondary'}
          className={cn(
            'bg-secondary text-secondary-foreground',
            `${isColorThemeActive('mono') ? 'ring-2 ring-offset-2 ring-blue-500' : ''} `
          )}
        >
          Mono
        </Button>
      </div>
    </main>
  )
}
