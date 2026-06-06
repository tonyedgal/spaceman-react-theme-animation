import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  TanStackThemeProvider,
  ThemeAnimationType,
} from '@space-man/react-theme-animation'

import NavBar from '../components/NavBar'
import BackgroundPattern from '../components/BackgroundPattern'
import {
  getThemeServerFn,
  setColorThemeServerFn,
  setThemeServerFn,
} from '../lib/theme'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Spaceman React Theme Animation - TanStack Start SSR',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  beforeLoad: async () => ({
    themeData: await getThemeServerFn(),
  }),
  shellComponent: RootDocument,
  component: RootComponent,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { themeData } = Route.useRouteContext()
  const htmlClass = [
    themeData.theme,
    themeData.colorTheme !== 'default' ? `theme-${themeData.colorTheme}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <html lang="en" className={htmlClass} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
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

function RootComponent() {
  const { themeData } = Route.useRouteContext()

  return (
    <TanStackThemeProvider
      themes={['light', 'dark', 'system']}
      colorThemes={[
        'default',
        'blue',
        'green',
        'purple',
        'caffeine',
        'mono',
        'supabase',
      ]}
      defaultTheme="system"
      defaultColorTheme="default"
      animationType={ThemeAnimationType.CIRCLE}
      duration={750}
      serverTheme={themeData.theme}
      serverColorTheme={themeData.colorTheme}
      systemThemeMode="css"
      onServerThemeChange={theme => setThemeServerFn({ data: theme })}
      onServerColorThemeChange={colorTheme =>
        setColorThemeServerFn({ data: colorTheme })
      }
    >
      <NavBar />
      <main className="relative min-h-screen w-full">
        <div className="relative grid min-h-screen grid-cols-[2.5rem_auto_2.5rem]">
          <div className="relative col-start-2 h-full w-full">
            <BackgroundPattern />
            <div className="gap-6 w-full">
              <Outlet />
            </div>
          </div>

          <div className="relative -right-px col-start-1 row-span-full row-start-1 border-x border-border bg-[image:repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]"></div>
          <div className="relative -left-px col-start-3 row-span-full row-start-1 border-x border-border bg-[image:repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]"></div>
          <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-border"></div>
          <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-border"></div>
        </div>
      </main>
    </TanStackThemeProvider>
  )
}
