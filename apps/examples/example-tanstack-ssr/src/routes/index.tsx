import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

import { ThemeSection } from '../components/ThemeSection'

export const Route = createFileRoute('/')({ component: App })

function App(): React.JSX.Element {
  return (
    <main className='min-h-screen bg-transparent transition-colors'>
      <ThemeSection />
    </main>
  )
}
