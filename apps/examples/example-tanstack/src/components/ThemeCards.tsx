import React from 'react'

const ThemeCards = () => {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>Theme Switcher</h2>
      <p className='text-muted-foreground'>
        Toggle between light, dark, and system themes with smooth animations.
      </p>

      <section className='border-border bg-background flex flex-wrap items-center gap-6 rounded-lg border p-6'></section>
    </div>
  )
}

export default ThemeCards
