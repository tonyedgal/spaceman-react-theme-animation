# Getting Started Guide

This guide provides detailed examples and advanced configurations for @space-man/react-theme-animation.

## Prerequisites

Make sure you have the library installed:

```bash
npm install @space-man/react-theme-animation
```

## Advanced Provider Configuration

The `SpacemanThemeProvider` offers extensive configuration options for complex applications.

```tsx
import {
  SpacemanThemeProvider,
  ThemeSwitcher,
  ThemeSelector,
  ThemeAnimationType,
} from '@space-man/react-theme-animation'

function App() {
  return (
    <SpacemanThemeProvider
      defaultTheme="system"
      defaultColorTheme="blue"
      themes={['light', 'dark', 'system']}
      colorThemes={['default', 'blue', 'green', 'purple', 'red']}
      animationType={ThemeAnimationType.BLUR_CIRCLE}
      blurAmount={10}
      duration={1000}
      onThemeChange={theme => {
        // Analytics, localStorage, etc.
        console.log('Global theme changed:', theme)
      }}
      onColorThemeChange={colorTheme => {
        console.log('Global color theme changed:', colorTheme)
      }}
    >
      <AppLayout />
    </SpacemanThemeProvider>
  )
}

function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <MainContent />
    </div>
  )
}

function Header() {
  return (
    <header className="header">
      <h1>My App</h1>
      <ThemeSwitcher className="ml-auto" />
    </header>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>Settings</h2>
      <ThemeSelector colorThemes={['default', 'blue', 'green', 'purple', 'red']} />
    </aside>
  )
}
```

## Using the Provider Hook

Access theme state anywhere in your component tree. This hook also enables you to set a reference point for the animation to start from.

```tsx
import { useSpacemanTheme } from '@space-man/react-theme-animation'

function ThemeStatus() {
  const { theme, colorTheme, switchTheme, setColorTheme, switchThemeFromElement } =
    useSpacemanTheme()

  const handleCustomThemeSwitch = event => {
    // Animate from the clicked element
    switchThemeFromElement('dark', event.currentTarget)
  }

  return (
    <div className="theme-status">
      <p>Current theme: {theme}</p>
      <p>Current color: {colorTheme}</p>

      <button onClick={handleCustomThemeSwitch}>Switch to Dark (with animation)</button>
    </div>
  )
}
```

## Complete Example: Advanced Theme System

Here's a complete example showcasing all features:

```tsx
import React from 'react'
import {
  SpacemanThemeProvider,
  ThemeSwitcher,
  ThemeSelector,
  useSpacemanTheme,
  ThemeAnimationType,
} from '@space-man/react-theme-animation'

// Main App with Provider
function App() {
  return (
    <SpacemanThemeProvider
      defaultTheme="system"
      defaultColorTheme="blue"
      themes={['light', 'dark', 'system']}
      colorThemes={['default', 'blue', 'green', 'purple', 'red', 'orange']}
      animationType={ThemeAnimationType.CIRCLE}
      duration={800}
      onThemeChange={theme => {
        // Save to localStorage, analytics, etc.
        localStorage.setItem('preferred-theme', theme)
      }}
      onColorThemeChange={colorTheme => {
        localStorage.setItem('preferred-color-theme', colorTheme)
      }}
    >
      <AppContent />
    </SpacemanThemeProvider>
  )
}

// App Layout
function AppContent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </div>
  )
}

// Header with Theme Switcher
function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Theme Demo</h1>
        <div className="flex items-center gap-4">
          <ThemeSwitcher className="rounded-lg" />
        </div>
      </div>
    </header>
  )
}

// Sidebar with Theme Selector
function Sidebar() {
  return (
    <aside className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Theme Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Color Theme</label>
            <ThemeSelector colorThemes={['default', 'blue', 'green', 'purple', 'red', 'orange']} />
          </div>
        </div>
      </div>

      <ThemeInfo />
    </aside>
  )
}

// Component using the theme hook
function ThemeInfo() {
  const { theme, colorTheme, switchThemeFromElement } = useSpacemanTheme()

  const quickSwitchTheme = (newTheme, event) => {
    switchThemeFromElement(newTheme, event.currentTarget)
  }

  return (
    <div className="bg-card p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Current State</h3>
      <div className="space-y-2 text-sm">
        <p>
          <strong>Theme:</strong> {theme}
        </p>
        <p>
          <strong>Color:</strong> {colorTheme}
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium">Quick Switch:</p>
        <div className="flex gap-2">
          {['light', 'dark'].map(t => (
            <button
              key={t}
              onClick={e => quickSwitchTheme(t, e)}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main content area
function MainContent() {
  return (
    <main className="lg:col-span-3 space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Welcome to Theme Demo</h2>
        <p className="text-muted-foreground">
          This demo showcases the @space-man/react-theme-animation library with synchronized theme
          state, smooth animations, and multiple color themes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-card p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">Card {i}</h3>
            <p className="text-sm text-muted-foreground">
              Sample content that adapts to the current theme and color scheme.
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default App
```

## Custom Hook Implementation

For advanced use cases, you can create custom hooks that extend the base functionality:

```tsx
import { useThemeAnimation } from '@space-man/react-theme-animation'
import { useCallback } from 'react'

function useCustomTheme() {
  const { theme, toggleTheme, switchTheme, ref } = useThemeAnimation({
    duration: 600,
    animationType: ThemeAnimationType.CIRCLE,
    onThemeChange: newTheme => {
      // Custom analytics
      analytics.track('theme_changed', { theme: newTheme })

      // Custom storage
      localStorage.setItem('app_theme', newTheme)
    },
  })

  const switchToSpecificTheme = useCallback(
    async (targetTheme: Theme) => {
      if (theme !== targetTheme) {
        await switchTheme(targetTheme)
      }
    },
    [theme, switchTheme]
  )

  return {
    theme,
    toggleTheme,
    switchToSpecificTheme,
    ref,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSystem: theme === 'system',
  }
}
```

## CSS Customization

You can customize the animations by adding your own CSS:

```css
/* Custom animation timing */
::view-transition-new(root) {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom animation for specific themes */
.theme-blue ::view-transition-new(root) {
  animation-duration: 600ms;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-new(root),
  ::view-transition-old(root) {
    animation-duration: 0.01ms !important;
  }
}
```

## Performance Tips

1. **Use appropriate durations**: 300-800ms for most animations
2. **Consider device performance**: The library automatically adjusts for high-resolution displays
3. **Debounce rapid clicks**: Implement your own debouncing if needed
4. **Reduce motion**: The library respects `prefers-reduced-motion`

## Troubleshooting

### Animation not working

- Ensure your browser supports the View Transitions API
- Check that `prefers-reduced-motion` is not set to `reduce`
- Verify the element has a proper ref attached

### Multiple providers conflict

- Use only one `SpacemanThemeProvider` at the root of your app
- For multiple isolated theme contexts, use separate hook instances

### State synchronization issues

- Use the provider pattern for synchronized state across components
- Avoid mixing controlled and uncontrolled components

## Migration Guide

### From v0.x to v1.x

- Update import paths to use the new package name `@space-man/react-theme-animation`
- Provider props remain the same
- Hook API is backward compatible

## Next Steps

- Explore the [API Reference](./README.md#api-reference) for detailed prop descriptions
- Check out the [example project](./example) for a complete implementation
- Join our [GitHub Discussions](https://github.com/tonyedgal/spaceman-react-theme-animation/discussions) for questions and feedback
