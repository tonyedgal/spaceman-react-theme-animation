import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

import { getPunkSongs } from '@/data/demo.punk-songs'

const copy = {
  fullSsrPunkSongs: 'Full SSR - Punk Songs',
  separator: ' - ',
}

export const Route = createFileRoute('/demo/start/ssr/full-ssr')({
  component: RouteComponent,
  loader: async () => getPunkSongs(),
})

function RouteComponent(): React.JSX.Element {
  const punkSongs = Route.useLoaderData()

  return (
    <div
      className='flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-800 to-black p-4 text-white'
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 20% 60%, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)',
      }}
    >
      <div className='w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md'>
        <h1 className='mb-6 text-3xl font-bold text-purple-400'>
          {copy.fullSsrPunkSongs}
        </h1>
        <ul className='space-y-3'>
          {punkSongs.map((song) => (
            <li
              key={song.id}
              className='rounded-lg border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-sm'
            >
              <span className='text-lg font-medium text-white'>
                {song.name}
              </span>
              <span className='text-white/60'>
                {' '}
                {copy.separator}
                {song.artist}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
