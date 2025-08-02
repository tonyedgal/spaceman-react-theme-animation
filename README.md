# @spaceman/react-theme-animation

React theme switching with smooth view transition animations and multi-theme support.

## Features

- 🎨 **Smooth Animations**: Beautiful view transition animations for theme switching
- 🌓 **Multi-Theme Support**: Support for light, dark, and system themes
- 🎯 **Color Themes**: Additional color theme variants (brand colors, etc.)
- 🪝 **Powerful Hook**: `useThemeAnimation` hook with full control
- 🧩 **Ready Components**: `ThemeSwitcher` and `ThemeSelector` components
- 📱 **Responsive**: Works on all screen sizes including high-resolution displays
- ⚡ **Performance**: Optimized animations with reduced motion support
- 🔧 **TypeScript**: Full TypeScript support with comprehensive types
- 🎛️ **Customizable**: Extensive configuration options

## Installation

```bash
npm install @spaceman/react-theme-animation
```

## Quick Start

### Basic Usage

```tsx
import { useThemeAnimation, ThemeSwitcher } from '@spaceman/react-theme-animation';

function App() {
  const { theme, toggleTheme } = useThemeAnimation();

  return (
    <div>
      <ThemeSwitcher />
      <button onClick={toggleTheme}>
        Current theme: {theme}
      </button>
    </div>
  );
}
```

### Advanced Usage

```tsx
import { 
  useThemeAnimation, 
  ThemeSwitcher, 
  ThemeSelector,
  ThemeAnimationType 
} from '@spaceman/react-theme-animation';

function App() {
  const {
    ref,
    theme,
    colorTheme,
    resolvedTheme,
    setTheme,
    setColorTheme,
    toggleTheme,
    switchTheme,
  } = useThemeAnimation({
    themes: ['light', 'dark', 'system'],
    colorThemes: ['default', 'blue', 'green', 'purple'],
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    duration: 500,
    onThemeChange: (theme) => console.log('Theme changed:', theme),
    onColorThemeChange: (colorTheme) => console.log('Color theme changed:', colorTheme),
  });

  return (
    <div>
      {/* Toggle-style switcher */}
      <ThemeSwitcher
        themes={['light', 'dark', 'system']}
        animationType={ThemeAnimationType.CIRCLE}
        size="lg"
        variant="outline"
      />

      {/* Dropdown-style selector */}
      <ThemeSelector
        themes={['light', 'dark', 'system']}
        colorThemes={['default', 'blue', 'green', 'purple']}
        animationType={ThemeAnimationType.BLUR_CIRCLE}
      />

      {/* Custom button with animation */}
      <button ref={ref} onClick={toggleTheme}>
        Toggle Theme ({resolvedTheme})
      </button>
    </div>
  );
}
```

## API Reference

### `useThemeAnimation(props?)`

The main hook that provides theme switching with animations.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `750` | Animation duration in milliseconds |
| `easing` | `string` | `'ease-in-out'` | CSS easing function |
| `animationType` | `ThemeAnimationType` | `'circle'` | Animation type: `'circle'` or `'blur-circle'` |
| `blurAmount` | `number` | `2` | Blur amount for blur-circle animation |
| `themes` | `Theme[]` | `['light', 'dark']` | Available themes |
| `colorThemes` | `string[]` | `['default']` | Available color themes |
| `defaultTheme` | `Theme` | `'system'` | Default theme |
| `defaultColorTheme` | `string` | `'default'` | Default color theme |
| `globalClassName` | `string` | `'dark'` | CSS class for dark mode |
| `colorThemePrefix` | `string` | `'theme-'` | Prefix for color theme classes |
| `theme` | `Theme` | - | External theme control |
| `colorTheme` | `string` | - | External color theme control |
| `onThemeChange` | `(theme: Theme) => void` | - | Theme change callback |
| `onColorThemeChange` | `(colorTheme: string) => void` | - | Color theme change callback |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `ref` | `RefObject<HTMLButtonElement>` | Ref for animation trigger element |
| `theme` | `Theme` | Current theme |
| `colorTheme` | `string` | Current color theme |
| `resolvedTheme` | `'light' \| 'dark'` | Resolved theme (system theme resolved) |
| `setTheme` | `(theme: Theme) => void` | Set theme without animation |
| `setColorTheme` | `(colorTheme: string) => void` | Set color theme |
| `toggleTheme` | `() => Promise<void>` | Toggle between light/dark with animation |
| `switchTheme` | `(theme: Theme) => Promise<void>` | Switch to specific theme with animation |

### `<ThemeSwitcher />`

A toggle-style component for switching themes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themes` | `Theme[]` | `['light', 'dark', 'system']` | Available themes |
| `currentTheme` | `Theme` | - | External theme control |
| `onThemeChange` | `(theme: Theme) => void` | - | Theme change callback |
| `animationType` | `ThemeAnimationType` | - | Animation type |
| `duration` | `number` | - | Animation duration |
| `className` | `string` | - | Additional CSS classes |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'default'` | Visual variant |
| `icons` | `object` | - | Custom icons for themes |

### `<ThemeSelector />`

A dropdown-style component for selecting themes and color themes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themes` | `Theme[]` | `['light', 'dark', 'system']` | Available themes |
| `colorThemes` | `string[]` | `['default']` | Available color themes |
| `currentTheme` | `Theme` | - | External theme control |
| `currentColorTheme` | `string` | - | External color theme control |
| `onThemeChange` | `(theme: Theme) => void` | - | Theme change callback |
| `onColorThemeChange` | `(colorTheme: string) => void` | - | Color theme change callback |
| `animationType` | `ThemeAnimationType` | - | Animation type |
| `duration` | `number` | - | Animation duration |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | `'Choose a theme'` | Select placeholder |
| `themeLabel` | `string` | `'Theme'` | Theme selector label |
| `colorThemeLabel` | `string` | `'Color Theme'` | Color theme selector label |

## CSS Setup

The package automatically injects base styles, but you need to set up your CSS for theme classes:

```css
/* Base theme styles */
:root {
  --background: white;
  --foreground: black;
}

.dark {
  --background: black;
  --foreground: white;
}

/* Color theme variants */
.theme-blue {
  --primary: blue;
}

.theme-green {
  --primary: green;
}

.theme-blue.dark {
  --primary: lightblue;
}

.theme-green.dark {
  --primary: lightgreen;
}
```

## Animation Types

### Circle Animation
A circular reveal animation that expands from the trigger element.

### Blur Circle Animation
A circular reveal with a blur effect for a softer transition.

## Browser Support

- Modern browsers with View Transition API support get smooth animations
- Fallback to instant theme switching for unsupported browsers
- Respects `prefers-reduced-motion` setting

## TypeScript

Full TypeScript support with comprehensive type definitions included.

## License

MIT
