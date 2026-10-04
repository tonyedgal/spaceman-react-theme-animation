'use client'

import React, { useState } from 'react'

import {
  ThemeAnimationType,
  ThemeSelector,
  ThemeSwitcher,
  useNextTheme,
} from '@space-man/react-theme-animation'

const copy = {
  themeSwitcher: 'Theme Switcher',
  toggleBetweenLightDarkAndSystemThemes:
    'Toggle between light, dark, and system themes with smooth animations.',
  defaultStyle: 'Default Style:',
  lightDarkOnly: 'Light/Dark Only:',
  themeSelector: 'Theme Selector:',
  animationSettings: 'Animation Settings',
  animationType: 'Animation Type:',
  circle: 'Circle',
  blurCircle: 'Blur Circle',
  currentTheme: 'Current theme:',
  color: 'Color:',
  usage: 'Usage',
  installation: 'Installation:',
  npmInstallSpaceManReactThemeAnimation:
    'npm install @space-man/react-theme-animation motion @radix-ui/react-select',
  basicUsage: 'Basic Usage:',
}

export function ThemeSection(): React.JSX.Element {
  const [animationType, setAnimationType] = useState<ThemeAnimationType>(
    ThemeAnimationType.CIRCLE,
  )

  const { theme: currentTheme, colorTheme: currentColorTheme } = useNextTheme()

  const animationControls = (
    <section className='space-y-4'>
      <h2 className='text-2xl font-semibold'>{copy.animationSettings}</h2>
      <div className='border-border bg-background rounded-lg border p-6'>
        <div className='flex flex-wrap items-center gap-6'>
          <div className='space-y-2'>
            <div className='flex gap-2'>
              <span className='text-md font-medium'>{copy.animationType}</span>
              <button
                type='button'
                onClick={() => {
                  setAnimationType(ThemeAnimationType.CIRCLE)
                }}
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  animationType === ThemeAnimationType.CIRCLE
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {copy.circle}
              </button>
              <button
                type='button'
                onClick={() => {
                  setAnimationType(ThemeAnimationType.BLUR_CIRCLE)
                }}
                className={`rounded px-3 py-1 text-sm transition-colors ${
                  animationType === ThemeAnimationType.BLUR_CIRCLE
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {copy.blurCircle}
              </button>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='text-md font-medium'>{copy.currentTheme}</div>
            <div className='bg-muted rounded px-2 py-1 font-mono'>
              {currentTheme}
            </div>
          </div>

          {currentColorTheme !== 'default' && (
            <div className='flex items-center gap-2'>
              <div className='text-md font-medium'>{copy.color}</div>
              <div className='bg-muted rounded px-2 py-1 font-mono'>
                {currentColorTheme}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )

  const usageInstructions = (
    <div className='space-y-4'>
      <h2 className='text-2xl font-semibold'>{copy.usage}</h2>
      <div className='border-border bg-background rounded-lg border p-6'>
        <div className='space-y-4 text-sm'>
          <div>
            <h3 className='mb-2 font-semibold'>{copy.installation}</h3>
            <code className='bg-muted block rounded p-3 font-mono text-xs'>
              {copy.npmInstallSpaceManReactThemeAnimation}
            </code>
          </div>

          <div>
            <h3 className='mb-2 font-semibold'>{copy.basicUsage}</h3>
            <code className='bg-muted block rounded p-3 font-mono text-xs whitespace-pre'>
              {`import { NextThemeProvider, ThemeSwitcher, ThemeSelector } from '@space-man/react-theme-animation';

<NextThemeProvider
  themes={['light', 'dark', 'system']}
  colorThemes={['default', 'blue', 'green', 'purple', 'caffeine', 'mono', 'supabase']}
  defaultTheme="system"
  defaultColorTheme="default"
>
  <ThemeSwitcher
   themes={['light', 'dark', 'system']}
   animationType={animationType}
   duration={400}
  />

  <ThemeSwitcher
   themes={['light', 'dark']}
   animationType={animationType}
   duration={400}
  />

  <ThemeSelector
    colorThemes={[
      'default',
      'blue',
      'green',
      'purple',
      'caffeine',
      'mono',
      'supabase',
    ]}
  />
</NextThemeProvider>
`}
            </code>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto mt-32 max-w-4xl space-y-8'>
        {/* Theme Switcher Examples */}
        <div className='space-y-6'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>{copy.themeSwitcher}</h2>
            <p className='text-muted-foreground'>
              {copy.toggleBetweenLightDarkAndSystemThemes}
            </p>

            <section className='border-border bg-background flex flex-wrap items-center gap-6 rounded-lg border p-6'>
              <div className='flex items-center gap-2'>
                <span className='text-md font-medium'>{copy.defaultStyle}</span>
                <ThemeSwitcher themes={['light', 'dark', 'system']} />
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-md font-medium'>
                  {copy.lightDarkOnly}
                </span>
                <ThemeSwitcher themes={['light', 'dark']} />
              </div>

              <div className='flex items-center gap-2'>
                <span className='text-md font-medium'>
                  {copy.themeSelector}
                </span>
                <ThemeSelector
                  colorThemes={[
                    'default',
                    'blue',
                    'green',
                    'purple',
                    'caffeine',
                    'mono',
                    'supabase',
                  ]}
                />
              </div>
            </section>
          </div>

          {/* Animation Controls */}
          {animationControls}

          {/* Usage Instructions */}
          {usageInstructions}
        </div>
      </div>
    </div>
  )
}

export default ThemeSection
