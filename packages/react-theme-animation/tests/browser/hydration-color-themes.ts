import React from 'react'

import {
  NextThemeProvider,
  SpacemanThemeProvider,
  TanStackThemeProvider,
  ViteThemeProvider,
  useNextTheme,
  useSpacemanTheme,
  useTanStackTheme,
  useThemeAnimation,
  useViteTheme,
} from '@space-man/react-theme-animation/react'

const colorThemes = ['default', 'ocean'] as const

type ColorThemesState = Readonly<{ colorThemes: readonly string[] }>

type ProviderProps = Readonly<{
  colorThemes: typeof colorThemes
  children: React.ReactNode
}>

function output(state: ColorThemesState): React.JSX.Element {
  return React.createElement('output', null, state.colorThemes.join(':'))
}

function HookColorThemes(): React.JSX.Element {
  return output(useThemeAnimation({ colorThemes }))
}

function SpacemanColorThemes(): React.JSX.Element {
  return output(useSpacemanTheme())
}

function NextColorThemes(): React.JSX.Element {
  return output(useNextTheme())
}

function ViteColorThemes(): React.JSX.Element {
  return output(useViteTheme())
}

function TanStackColorThemes(): React.JSX.Element {
  return output(useTanStackTheme())
}

// providers require children in their props, so React.createElement cannot take them as a third argument
function providerProps(children: React.ReactNode): ProviderProps {
  return { colorThemes, children }
}

export const colorThemeApps = {
  hook: (): React.JSX.Element => React.createElement(HookColorThemes),
  spaceman: (): React.JSX.Element =>
    React.createElement(
      SpacemanThemeProvider,
      providerProps(React.createElement(SpacemanColorThemes)),
    ),
  next: (): React.JSX.Element =>
    React.createElement(
      NextThemeProvider,
      providerProps(React.createElement(NextColorThemes)),
    ),
  vite: (): React.JSX.Element =>
    React.createElement(
      ViteThemeProvider,
      providerProps(React.createElement(ViteColorThemes)),
    ),
  tanstack: (): React.JSX.Element =>
    React.createElement(
      TanStackThemeProvider,
      providerProps(React.createElement(TanStackColorThemes)),
    ),
}
