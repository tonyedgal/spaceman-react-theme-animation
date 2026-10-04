import React from 'react'

import { useTanStackTheme } from '@space-man/react-theme-animation/react'

import { Controls } from './fixture-Controls'

import './fixture.css'

export function TanStackControls(): React.JSX.Element {
  return <Controls state={useTanStackTheme()} />
}
