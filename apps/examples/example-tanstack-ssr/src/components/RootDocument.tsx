import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import React from 'react'

import { Route } from '../routes/__root'

export function RootDocument({
  children,
}: {
  readonly children: React.ReactNode
}): React.JSX.Element {
  const { themeData } = Route.useRouteContext()

  const htmlClass = [
    themeData.theme,
    themeData.colorTheme !== 'default' ? `theme-${themeData.colorTheme}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <html lang='en' className={htmlClass} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className='antialiased'>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
