import React from 'react'
import { createRoot } from 'react-dom/client'

import {
  NextThemeProvider,
  SpacemanThemeProvider,
  TanStackThemeProvider,
  ViteThemeProvider,
} from '@space-man/react-theme-animation/react'

import { callbacks, config, params, provider } from './fixture-config'
import { HookControls } from './fixture-HookControls'
import { NextControls } from './fixture-NextControls'
import { TanStackControls } from './fixture-TanStackControls'
import { required } from './fixture-types'
import { UIControls } from './fixture-UIControls'
import { ViteControls } from './fixture-ViteControls'

import './fixture.css'

const disableTransitionOnChange = params.has('disableTransitions')

const app: React.JSX.Element =
  provider === 'ui' ? (
    <SpacemanThemeProvider
      {...config}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      <UIControls />
    </SpacemanThemeProvider>
  ) : provider === 'next' ? (
    <NextThemeProvider
      {...config}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      <NextControls />
    </NextThemeProvider>
  ) : provider === 'vite' ? (
    <ViteThemeProvider
      {...config}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      <ViteControls />
    </ViteThemeProvider>
  ) : provider === 'tanstack' ? (
    <TanStackThemeProvider
      {...config}
      {...callbacks}
      disableTransitionOnChange={disableTransitionOnChange}
    >
      <TanStackControls />
    </TanStackThemeProvider>
  ) : (
    <HookControls />
  )

createRoot(required(document.getElementById('root'))).render(app)
