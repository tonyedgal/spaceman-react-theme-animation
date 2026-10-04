import React from 'react'
import { hydrateRoot } from 'react-dom/client'

import { HydrationApp } from './hydration-app'

const root = document.getElementById('root')

if (root === null) throw new Error('Missing hydration root')

hydrateRoot(root, <HydrationApp />)
