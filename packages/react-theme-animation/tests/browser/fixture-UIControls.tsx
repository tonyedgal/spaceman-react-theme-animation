import React from 'react'

import { useSpacemanTheme } from '../../src/react'
import { Controls } from './fixture-Controls'

import './fixture.css'

export function UIControls(): React.JSX.Element {
  return <Controls state={useSpacemanTheme()} />
}
