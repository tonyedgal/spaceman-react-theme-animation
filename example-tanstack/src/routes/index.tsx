import { createFileRoute } from '@tanstack/react-router'
import { ThemeSection } from '../components/ThemeSection'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="min-h-screen bg-transparent transition-colors">
      <ThemeSection />
    </main>
  )
}
