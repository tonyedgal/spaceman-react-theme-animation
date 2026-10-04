import React from 'react'
import { createRoot } from 'react-dom/client'

import {
  NextThemeProvider,
  SpacemanThemeProvider,
  TanStackThemeProvider,
  ViteThemeProvider,
} from '../../src/react'
import { callbacks, config, provider } from './fixture-config'
import { HookControls } from './fixture-HookControls'
import { NextControls } from './fixture-NextControls'
import { TanStackControls } from './fixture-TanStackControls'
import { required } from './fixture-types'
import { UIControls } from './fixture-UIControls'
import { ViteControls } from './fixture-ViteControls'

import './fixture.css'

const app: React.JSX.Element =
  provider === 'ui' ? (
    <SpacemanThemeProvider {...config}>
      <UIControls />
    </SpacemanThemeProvider>
  ) : provider === 'next' ? (
    <NextThemeProvider {...config}>
      <NextControls />
    </NextThemeProvider>
  ) : provider === 'vite' ? (
    <ViteThemeProvider {...config}>
      <ViteControls />
    </ViteThemeProvider>
  ) : provider === 'tanstack' ? (
    <TanStackThemeProvider {...config} {...callbacks}>
      <TanStackControls />
    </TanStackThemeProvider>
  ) : (
    <HookControls />
  )

createRoot(required(document.getElementById('root'))).render(app)
