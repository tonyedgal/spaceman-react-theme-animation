import { SpacemanThemeProvider } from '../components/SpacemanThemeProvider'
import ThemeSection from '@/components/ThemeSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent transition-colors">
      <SpacemanThemeProvider
        themes={['light', 'dark', 'system']}
        colorThemes={['default', 'blue', 'green', 'purple', 'caffeine', 'mono', 'supabase']}
        defaultTheme="system"
        defaultColorTheme="default"
      >
        <ThemeSection />
      </SpacemanThemeProvider>
    </main>
  )
}
