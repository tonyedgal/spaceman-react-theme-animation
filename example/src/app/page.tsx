'use client';

import { useState } from 'react';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { ThemeSelector } from '../components/ThemeSelector';
import { ThemeAnimationType } from '../types';
import { useSpacemanTheme } from '../components/SpacemanThemeProvider';

export default function Home() {
  const [animationType, setAnimationType] = useState<ThemeAnimationType>(ThemeAnimationType.CIRCLE);

  const {
    theme: currentTheme,
    colorTheme: currentColorTheme,
    setTheme,
    setColorTheme,
  } = useSpacemanTheme();

  return (
    <main className="min-h-screen bg-transparent transition-colors">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8 mt-32">
          {/* Theme Switcher Examples */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Theme Switcher</h2>
              <p className="text-muted-foreground">
                Toggle between light, dark, and system themes with smooth animations.
              </p>

              <section className="flex flex-wrap items-center gap-6 p-6 rounded-lg border border-border bg-background">
                <div className="flex gap-2 items-center">
                  <label className="text-md font-medium">Default Style:</label>
                  <ThemeSwitcher
                    themes={['light', 'dark', 'system']}
                    currentTheme={currentTheme}
                    onThemeChange={setTheme}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <label className="text-md font-medium">Light/Dark Only:</label>
                  <ThemeSwitcher
                    themes={['light', 'dark']}
                    currentTheme={currentTheme}
                    onThemeChange={setTheme}
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <label className="text-md font-medium">Theme Selector:</label>
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
                    currentColorTheme={currentColorTheme}
                    onColorThemeChange={setColorTheme}
                  />
                </div>
              </section>
            </div>

            {/* Animation Controls */}
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Animation Settings</h2>
              <div className="p-6 rounded-lg border border-border bg-background">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <label className="text-md font-medium">Animation Type:</label>
                      <button
                        onClick={() => setAnimationType(ThemeAnimationType.CIRCLE)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          animationType === ThemeAnimationType.CIRCLE
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        Circle
                      </button>
                      <button
                        onClick={() => setAnimationType(ThemeAnimationType.BLUR_CIRCLE)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          animationType === ThemeAnimationType.BLUR_CIRCLE
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                      >
                        Blur Circle
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <div className="text-md font-medium">Current theme:</div>
                    <div className="font-mono bg-muted px-2 py-1 rounded">{currentTheme}</div>
                  </div>

                  {currentColorTheme !== 'default' && (
                    <div className="flex gap-2 items-center">
                      <div className="text-md font-medium">Color:</div>
                      <div className="font-mono bg-muted px-2 py-1 rounded">
                        {currentColorTheme}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Usage Instructions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Usage</h2>
              <div className="p-6 rounded-lg border border-border bg-background">
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="font-semibold mb-2">Installation:</h3>
                    <code className="block bg-muted p-3 rounded font-mono text-xs">
                      npm install @spaceman/react-theme-animation motion @radix-ui/react-select
                    </code>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Basic Usage:</h3>
                    <code className="block bg-muted p-3 rounded font-mono text-xs whitespace-pre">
                      {`import { ThemeSwitcher, ThemeSelector } from '@spaceman/react-theme-animation';

<SpacemanThemeProvider
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
    currentColorTheme={currentColorTheme}
    onColorThemeChange={setColorTheme}
  />
</SpacemanThemeProvider>
`}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
