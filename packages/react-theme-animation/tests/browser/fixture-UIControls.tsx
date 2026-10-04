import React from 'react'

import { useSpacemanTheme } from '@space-man/react-theme-animation/react'

import { Controls } from './fixture-Controls'

import './fixture.css'

export function UIControls(): React.JSX.Element {
  return <Controls state={useSpacemanTheme()} />
}
