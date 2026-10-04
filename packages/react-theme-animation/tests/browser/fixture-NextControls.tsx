import React from 'react'

import { useNextTheme } from '@space-man/react-theme-animation/react'

import { Controls } from './fixture-Controls'

import './fixture.css'

export function NextControls(): React.JSX.Element {
  return <Controls state={useNextTheme()} />
}
