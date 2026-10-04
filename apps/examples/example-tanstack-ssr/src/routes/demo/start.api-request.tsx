import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'

const copy = {
  startApiRequestDemoNamesList: 'Start API Request Demo - Names List',
}

const namesSchema = z.array(z.string())

async function getNames(): Promise<string[]> {
  const response = await fetch('/demo/api/names')

  if (!response.ok) throw new Error('Names request failed')

  return namesSchema.parse(await response.json())
}

export const Route = createFileRoute('/demo/start/api-request')({
  component: Home,
})

export function Home(): React.JSX.Element {
  const [names, setNames] = useState<string[]>([])

  useEffect(() => {
    void getNames().then(setNames).catch(console.error)
  }, [])

  return (
    <div
      className='flex min-h-screen items-center justify-center p-4 text-white'
      style={{
        backgroundColor: '#000',
        backgroundImage:
          'radial-gradient(ellipse 60% 60% at 0% 100%, #444 0%, #222 60%, #000 100%)',
      }}
    >
      <div className='w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md'>
        <h1 className='mb-4 text-2xl'>{copy.startApiRequestDemoNamesList}</h1>
        <ul className='mb-4 space-y-2'>
          {names.map((name) => (
            <li
              key={name}
              className='rounded-lg border border-white/20 bg-white/10 p-3 shadow-md backdrop-blur-sm'
            >
              <span className='text-lg text-white'>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
