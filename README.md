# @space-man/react-theme-animation

React theme switching with smooth view transition animations, multi-theme support, and synchronized state management.

## Features

- 🎨 **Smooth Animations**: Beautiful view transition animations for theme switching with customizable origins
- 🌓 **Multi-Theme Support**: Support for light, dark, and system themes
- 🎯 **Color Themes**: Additional color theme variants (brand colors, etc.)
- 🪝 **Powerful Hook**: `useThemeAnimation` hook with full control
- 🧩 **Ready Components**: `ThemeSwitcher` and `ThemeSelector` components
- 🎛️ **Provider Pattern**: Centralized theme state management with `SpacemanThemeProvider`
- 🔄 **State Synchronization**: Prevents state drift between multiple components
- 📱 **Responsive**: Works on all screen sizes including high-resolution displays
- ⚡ **Performance**: Optimized animations with reduced motion support
- 🔧 **TypeScript**: Full TypeScript support with comprehensive types
- 🎛️ **Customizable**: Extensive configuration options
- 🔙 **Backward Compatible**: Works with existing implementations

## Installation

```bash
npm install @space-man/react-theme-animation
```

## Usage Patterns

This library supports two main usage patterns:

1. **Hook-Only Usage**: Direct hook usage for custom implementations
2. **Provider Pattern**: Centralized state management (recommended)

📚 **[See the complete Getting Started Guide](./getting-started.md)** for detailed examples, advanced configurations, and best practices.

🚀 **[View the Code Example](./example/)** to see this package in action with a complete implementation of both hook and provider pattern.

---

## 1. Hook-Only Usage For Light and Dark mode animation

Perfect for custom theme toggle buttons and complete control over animated theme logic.

### Basic Theme Toggle

```tsx
import { useThemeAnimation } from '@space-man/react-theme-animation'

function ThemeToggle() {
  const { theme, toggleTheme, ref } = useThemeAnimation()

  return (
    <button ref={ref} onClick={toggleTheme} className="theme-toggle-btn">
      {theme === 'light' ? '🌙' : '🌞'} {theme}
    </button>
  )
}
```

---

## 2. Provider Pattern (Recommended)

The most powerful pattern using `SpacemanThemeProvider` for centralized theme state management. This prevents state drift and provides synchronized animations.

### Basic Provider Setup

```tsx
import {
  SpacemanThemeProvider,
  ThemeSwitcher,
  ThemeSelector,
} from '@space-man/react-theme-animation'

function App() {
  return (
    <SpacemanThemeProvider>
      <div className="app">
        <header>
          <ThemeSwitcher />
        </header>

        <aside>
          <ThemeSelector colorThemes={['default', 'blue', 'green', 'purple']} />
        </aside>

        <main>
          <YourAppContent />
        </main>
      </div>
    </SpacemanThemeProvider>
  )
}
```

---

## API Reference

### SpacemanThemeProvider

Context provider for centralized theme state management.

```tsx
<SpacemanThemeProvider
  defaultTheme="system"
  defaultColorTheme="blue"
  themes={['light', 'dark', 'system']}
  colorThemes={['default', 'blue', 'green', 'purple']}
  animationType={ThemeAnimationType.CIRCLE}
  duration={800}
  onThemeChange={theme => console.log('Theme:', theme)}
  onColorThemeChange={colorTheme => console.log('Color:', colorTheme)}
>
  <App />
</SpacemanThemeProvider>
```

#### SpacemanThemeProvider Props

| Property             | Type                               | Default                       | Description                           |
| -------------------- | ---------------------------------- | ----------------------------- | ------------------------------------- |
| `defaultTheme`       | `Theme`                            | `'system'`                    | Initial theme                         |
| `defaultColorTheme`  | `ColorTheme`                       | `'default'`                   | Initial color theme                   |
| `themes`             | `Theme[]`                          | `['light', 'dark', 'system']` | Available themes                      |
| `colorThemes`        | `ColorTheme[]`                     | `['default']`                 | Available color themes                |
| `animationType`      | `ThemeAnimationType`               | `ThemeAnimationType.CIRCLE`   | Animation type                        |
| `duration`           | `number`                           | `500`                         | Animation duration in ms              |
| `blurAmount`         | `number`                           | `2`                           | Blur amount for blur-circle animation |
| `onThemeChange`      | `(theme: Theme) => void`           | -                             | Global theme change callback          |
| `onColorThemeChange` | `(colorTheme: ColorTheme) => void` | -                             | Global color theme change callback    |

### useSpacemanTheme

Hook to access theme state from SpacemanThemeProvider context.

```tsx
const { theme, colorTheme, switchTheme, setColorTheme, switchThemeFromElement, ref } =
  useSpacemanTheme()
```

#### Returns

| Property                 | Type                                                    | Description                                       |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------- |
| `theme`                  | `Theme`                                                 | Current theme                                     |
| `colorTheme`             | `ColorTheme`                                            | Current color theme                               |
| `switchTheme`            | `(theme: Theme) => Promise<void>`                       | Switch to specific theme                          |
| `setColorTheme`          | `(colorTheme: ColorTheme) => void`                      | Set color theme                                   |
| `switchThemeFromElement` | `(theme: Theme, element: HTMLElement) => Promise<void>` | Switch theme with animation from specific element |
| `ref`                    | `RefObject<HTMLElement>`                                | Ref for animation origin                          |

### useThemeAnimation

Standalone hook for theme management and animations.

```tsx
const { theme, colorTheme, switchTheme, setColorTheme, toggleTheme, ref } = useThemeAnimation({
  themes: ['light', 'dark', 'system'],
  colorThemes: ['default', 'blue', 'green', 'purple'],
  animationType: ThemeAnimationType.SCALE,
  duration: 800,
  onThemeChange: theme => console.log('Theme changed:', theme),
  onColorThemeChange: colorTheme => console.log('Color changed:', colorTheme),
})
```

#### Options

| Property             | Type                               | Default                       | Description                           |
| -------------------- | ---------------------------------- | ----------------------------- | ------------------------------------- |
| `themes`             | `Theme[]`                          | `['light', 'dark', 'system']` | Available themes                      |
| `colorThemes`        | `ColorTheme[]`                     | `['default']`                 | Available color themes                |
| `theme`              | `Theme`                            | `'system'`                    | Initial theme                         |
| `colorTheme`         | `ColorTheme`                       | `'default'`                   | Initial color theme                   |
| `animationType`      | `ThemeAnimationType`               | `ThemeAnimationType.CIRCLE`   | Animation type                        |
| `duration`           | `number`                           | `500`                         | Animation duration in ms              |
| `blurAmount`         | `number`                           | `2`                           | Blur amount for blur-circle animation |
| `onThemeChange`      | `(theme: Theme) => void`           | -                             | Theme change callback                 |
| `onColorThemeChange` | `(colorTheme: ColorTheme) => void` | -                             | Color theme change callback           |

#### Return

| Property        | Type                               | Description               |
| --------------- | ---------------------------------- | ------------------------- |
| `theme`         | `Theme`                            | Current theme             |
| `colorTheme`    | `ColorTheme`                       | Current color theme       |
| `switchTheme`   | `(theme: Theme) => Promise<void>`  | Switch to specific theme  |
| `setColorTheme` | `(colorTheme: ColorTheme) => void` | Set color theme           |
| `toggleTheme`   | `() => Promise<void>`              | Toggle between light/dark |
| `ref`           | `RefObject<HTMLElement>`           | Ref for animation origin  |

### ThemeSwitcher

Pre-built theme switcher component with animated buttons.

```tsx
<ThemeSwitcher
  themes={['light', 'dark', 'system']}
  currentTheme="light"
  onThemeChange={theme => console.log(theme)}
  animationType={ThemeAnimationType.CIRCLE}
  duration={600}
  className="custom-class"
/>
```

#### ThemeSwitcher Props

| Property        | Type                     | Default                       | Description                         |
| --------------- | ------------------------ | ----------------------------- | ----------------------------------- |
| `themes`        | `Theme[]`                | `['light', 'dark', 'system']` | Available themes                    |
| `currentTheme`  | `Theme`                  | -                             | Controlled current theme (optional) |
| `onThemeChange` | `(theme: Theme) => void` | -                             | Theme change callback (optional)    |
| `animationType` | `ThemeAnimationType`     | `ThemeAnimationType.CIRCLE`   | Animation type                      |
| `duration`      | `number`                 | `500`                         | Animation duration in ms            |
| `className`     | `string`                 | -                             | Additional CSS classes              |

> **Note**: When used with `SpacemanThemeProvider`, `currentTheme` and `onThemeChange` are automatically handled by the context.

### ThemeSelector

Dropdown selector for color themes.

```tsx
<ThemeSelector
  colorThemes={['default', 'blue', 'green', 'purple']}
  currentColorTheme="blue"
  onColorThemeChange={colorTheme => console.log(colorTheme)}
  animationType={ThemeAnimationType.BLUR_CIRCLE}
  duration={400}
/>
```

#### ThemeSelector Props

| Property             | Type                               | Default                       | Description                               |
| -------------------- | ---------------------------------- | ----------------------------- | ----------------------------------------- |
| `themes`             | `Theme[]`                          | `['light', 'dark', 'system']` | Available themes (for standalone hook)    |
| `colorThemes`        | `ColorTheme[]`                     | `['default']`                 | Available color themes                    |
| `currentColorTheme`  | `ColorTheme`                       | -                             | Controlled current color theme (optional) |
| `onColorThemeChange` | `(colorTheme: ColorTheme) => void` | -                             | Color theme change callback (optional)    |
| `animationType`      | `ThemeAnimationType`               | `ThemeAnimationType.CIRCLE`   | Animation type                            |
| `duration`           | `number`                           | `500`                         | Animation duration in ms                  |

> **Note**: When used with `SpacemanThemeProvider`, `currentColorTheme` and `onColorThemeChange` are automatically handled by the context.

### ThemeAnimationType

Animation types for theme transitions.

```tsx
enum ThemeAnimationType {
  CIRCLE = 'circle',
  BLUR_CIRCLE = 'blur-circle',
}
```

### Types

```tsx
type Theme = 'light' | 'dark' | 'system'
type ColorTheme = string // e.g., 'default', 'blue', 'green', etc.

interface SpacemanThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  animationType?: ThemeAnimationType
  duration?: number
  blurAmount?: number
  onThemeChange?: (theme: Theme) => void
  onColorThemeChange?: (colorTheme: ColorTheme) => void
}

interface UseThemeAnimationProps {
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  theme?: Theme
  colorTheme?: ColorTheme
  animationType?: ThemeAnimationType
  duration?: number
  blurAmount?: number
  onThemeChange?: (theme: Theme) => void
  onColorThemeChange?: (colorTheme: ColorTheme) => void
}

interface UseThemeAnimationReturn {
  theme: Theme
  colorTheme: ColorTheme
  switchTheme: (theme: Theme) => Promise<void>
  setColorTheme: (colorTheme: ColorTheme) => void
  toggleTheme: () => Promise<void>
  ref: RefObject<HTMLElement>
}

interface ThemeSwitcherProps {
  themes?: Theme[]
  currentTheme?: Theme
  onThemeChange?: (theme: Theme) => void
  animationType?: ThemeAnimationType
  duration?: number
  className?: string
}

interface ThemeSelectorProps {
  themes?: Theme[]
  colorThemes?: ColorTheme[]
  currentColorTheme?: ColorTheme
  onColorThemeChange?: (colorTheme: ColorTheme) => void
  animationType?: ThemeAnimationType
  duration?: number
}
```

---

## CSS Variables

The library uses CSS custom properties for theming. Define these in your CSS:

```css
/* Base theme variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

/* Dark theme */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}

/* Add other theme variants from design system or tweakcn */

.theme-supabase {
  --background: oklch(0.9911 0 0);
  --foreground: oklch(0.2046 0 0);
}

.theme-supabase.dark {
  --background: oklch(0.1822 0 0);
  --foreground: oklch(0.9288 0.0126 255.5078);
}

.theme-mono {
  --background: oklch(1 0 0);
  --foreground: oklch(0.1448 0 0);
}

.theme-mono.dark {
  --background: oklch(0.1448 0 0);
  --foreground: oklch(1 0 0);
}
```

---

## Browser Support

- **View Transitions API**: Chrome 111+, Edge 111+
- **Fallback**: All modern browsers with CSS transitions
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Framework Support**: React 16.8+ (hooks required)

---

## Performance

- Animations use the View Transitions API when available
- Optimized for 60fps animations
- Respects `prefers-reduced-motion` setting

---

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT
