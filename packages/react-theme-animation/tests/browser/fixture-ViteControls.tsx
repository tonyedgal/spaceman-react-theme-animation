import React from 'react'

import { useViteTheme } from '@space-man/react-theme-animation/react'

import { Controls } from './fixture-Controls'

import './fixture.css'

export function ViteControls(): React.JSX.Element {
  return <Controls state={useViteTheme()} />
}
