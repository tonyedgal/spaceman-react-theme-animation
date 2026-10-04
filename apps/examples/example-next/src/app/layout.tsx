import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import React from 'react'

import NavBar from '@/components/NavBar'

import './globals.css'

import BackgroundPattern from '../components/BackgroundPattern'
import { ThemeProvider } from '../components/theme/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Spaceman React Theme Animation',
  description: 'React Theme Animation for ReactJS, NextJS',
}

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode
}): React.JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.className} ${geistMono.variable} overflow-hidden antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          <main className='relative min-h-screen w-full'>
            <div className='relative grid min-h-screen grid-cols-[2.5rem_auto_2.5rem]'>
              <div className='relative col-start-2 h-full w-full'>
                <BackgroundPattern />
                <div className='w-full gap-6'>{children}</div>
              </div>

              <div className='border-border relative -right-px col-start-1 row-span-full row-start-1 border-x bg-[image:repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]' />
              <div className='border-border relative -left-px col-start-3 row-span-full row-start-1 border-x bg-[image:repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]' />
              <div className='bg-border relative -bottom-px col-span-full col-start-1 row-start-2 h-px' />
              <div className='bg-border relative -top-px col-span-full col-start-1 row-start-4 h-px' />
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
