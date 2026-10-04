'use client'

import { useState } from 'react'

import {
  ThemeAnimationType,
  ThemeSelector,
  ThemeSwitcher,
  useNextTheme,
} from '@space-man/react-theme-animation'

export const ThemeSection = () => {
  const [animationType, setAnimationType] = useState<ThemeAnimationType>(
    ThemeAnimationType.CIRCLE,
  )
  const { theme: currentTheme, colorTheme: currentColorTheme } = useNextTheme()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto mt-32 max-w-4xl space-y-8'>
        {/* Theme Switcher Examples */}
        <div className='space-y-6'>
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Theme Switcher</h2>
            <p className='text-muted-foreground'>
              Toggle between light, dark, and system themes with smooth
              animations.
            </p>

            <section className='border-border bg-background flex flex-wrap items-center gap-6 rounded-lg border p-6'>
              <div className='flex items-center gap-2'>
                <label className='text-md font-medium'>Default Style:</label>
                <ThemeSwitcher themes={['light', 'dark', 'system']} />
              </div>

              <div className='flex items-center gap-2'>
                <label className='text-md font-medium'>Light/Dark Only:</label>
                <ThemeSwitcher themes={['light', 'dark']} />
              </div>

              <div className='flex items-center gap-2'>
                <label className='text-md font-medium'>Theme Selector:</label>
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
          <section className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Animation Settings</h2>
            <div className='border-border bg-background rounded-lg border p-6'>
              <div className='flex flex-wrap items-center gap-6'>
                <div className='space-y-2'>
                  <div className='flex gap-2'>
                    <label className='text-md font-medium'>
                      Animation Type:
                    </label>
                    <button
                      onClick={() =>
                        setAnimationType(ThemeAnimationType.CIRCLE)
                      }
                      className={`rounded px-3 py-1 text-sm transition-colors ${
                        animationType === ThemeAnimationType.CIRCLE
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      Circle
                    </button>
                    <button
                      onClick={() =>
                        setAnimationType(ThemeAnimationType.BLUR_CIRCLE)
                      }
                      className={`rounded px-3 py-1 text-sm transition-colors ${
                        animationType === ThemeAnimationType.BLUR_CIRCLE
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent'
                      }`}
                    >
                      Blur Circle
                    </button>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='text-md font-medium'>Current theme:</div>
                  <div className='bg-muted rounded px-2 py-1 font-mono'>
                    {currentTheme}
                  </div>
                </div>

                {currentColorTheme !== 'default' && (
                  <div className='flex items-center gap-2'>
                    <div className='text-md font-medium'>Color:</div>
                    <div className='bg-muted rounded px-2 py-1 font-mono'>
                      {currentColorTheme}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Usage Instructions */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Usage</h2>
            <div className='border-border bg-background rounded-lg border p-6'>
              <div className='space-y-4 text-sm'>
                <div>
                  <h3 className='mb-2 font-semibold'>Installation:</h3>
                  <code className='bg-muted block rounded p-3 font-mono text-xs'>
                    npm install @space-man/react-theme-animation motion
                    @radix-ui/react-select
                  </code>
                </div>

                <div>
                  <h3 className='mb-2 font-semibold'>Basic Usage:</h3>
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
   duration={750}
  />
                        
  <ThemeSwitcher
   themes={['light', 'dark']}
   animationType={animationType}
   duration={750}
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
        </div>
      </div>
    </div>
  )
}

export default ThemeSection
