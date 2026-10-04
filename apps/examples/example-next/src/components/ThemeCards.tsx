import React from 'react'

const copy = {
  themeSwitcher: 'Theme Switcher',
  toggleBetweenLightDarkAndSystemThemes:
    'Toggle between light, dark, and system themes with smooth animations.',
}

function ThemeCards(): React.JSX.Element {
  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>{copy.themeSwitcher}</h2>
      <p className='text-muted-foreground'>
        {copy.toggleBetweenLightDarkAndSystemThemes}
      </p>

      <section className='border-border bg-background flex flex-wrap items-center gap-6 rounded-lg border p-6' />
    </div>
  )
}

export default ThemeCards
