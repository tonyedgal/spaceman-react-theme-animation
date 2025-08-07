import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme/theme-provider';
import { SpacemanThemeProvider } from '../components/SpacemanThemeProvider';
import BackgroundPattern from '../components/BackgroundPattern';
import NavBar from '@/components/NavBar';
// import CrossBackground from '../components/CrossBackground';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Spaceman React Theme Animation',
  description: 'React Theme Animation for ReactJS, NextJS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} ${geistMono.variable} antialiased overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SpacemanThemeProvider
            themes={['light', 'dark', 'system']}
            colorThemes={['default', 'blue', 'green', 'purple', 'caffeine', 'mono', 'supabase']}
            defaultTheme="system"
            defaultColorTheme="default"
          >
            <NavBar />
            <main className="relative min-h-screen w-full">
              <div className="relative grid min-h-screen grid-cols-[2.5rem_auto_2.5rem]">
                <div className="relative col-start-2 h-full w-full">
                  <BackgroundPattern />
                  <div className="gap-6 w-full">{children}</div>
                </div>

                <div className="relative -right-px col-start-1 row-span-full row-start-1 border-x border-border bg-[image:repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]"></div>
                <div className="relative -left-px col-start-3 row-span-full row-start-1 border-x border-border bg-[image:repeating-linear-gradient(315deg,var(--border)_0,var(--border)_1px,transparent_0,transparent_50%)] bg-[size:10px_10px]"></div>
                <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-border"></div>
                <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-border"></div>
              </div>
            </main>
          </SpacemanThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
