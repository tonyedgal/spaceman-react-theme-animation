import React from 'react'

import { useNextTheme } from '../../src/react'
import { Controls } from './fixture-Controls'

import './fixture.css'

export function NextControls(): React.JSX.Element {
  return <Controls state={useNextTheme()} />
}
