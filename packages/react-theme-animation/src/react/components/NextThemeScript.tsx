'use client'

import React from 'react'

import type { ColorTheme, Theme } from '../../core/types'
import { serializeScriptValue } from './serialize-script-value'

const generatePreHydrationScript = ({
  attribute,
  colorStorageKey,
  colorThemePrefix,
  defaultColorTheme,
  defaultTheme,
  enableColorScheme,
  enableSystem,
  globalClassName,
  storageKey,
  value,
}: Readonly<{
  readonly attribute: 'class' | 'data-theme'
  readonly colorStorageKey: string
  readonly colorThemePrefix: string
  readonly defaultColorTheme: ColorTheme
  readonly defaultTheme: Theme
  readonly enableColorScheme: boolean
  readonly enableSystem: boolean
  readonly globalClassName: string
  readonly storageKey: string
  readonly value?: Record<string, string>
}>): string => {
  const lightValue = value?.light ?? 'light'
  const darkValue = value?.dark ?? globalClassName
  const systemValue = value?.system ?? 'system'

  return `(function(){try{var d=document.documentElement;var theme=localStorage.getItem(${serializeScriptValue(storageKey)})||${serializeScriptValue(defaultTheme)};var colorTheme=localStorage.getItem(${serializeScriptValue(colorStorageKey)})||${serializeScriptValue(defaultColorTheme)};if(!${JSON.stringify(
    enableSystem,
  )}&&theme==='system'){theme=${serializeScriptValue(defaultTheme === 'system' ? 'light' : defaultTheme)};}var resolved=theme==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):theme;var attr=${serializeScriptValue(attribute)};var lightValue=${serializeScriptValue(lightValue)};var darkValue=${serializeScriptValue(darkValue)};var systemValue=${serializeScriptValue(systemValue)};if(attr==='data-theme'){d.setAttribute('data-theme',theme==='system'?systemValue:(resolved==='dark'?darkValue:lightValue));}else{d.classList.remove(lightValue,darkValue,systemValue,'auto');d.classList.add(theme==='system'?systemValue:(resolved==='dark'?darkValue:lightValue));}if(${JSON.stringify(
    enableColorScheme,
  )}){d.style.colorScheme=theme==='system'?'':resolved;}else{d.style.removeProperty('color-scheme');}d.classList.add(${serializeScriptValue(colorThemePrefix)}+colorTheme);}catch(e){console.warn('Theme pre-hydration script failed:',e);}})();`
}

export const ThemePreHydrationScript = React.memo(function ({
  attribute,
  colorStorageKey,
  colorThemePrefix,
  defaultColorTheme,
  defaultTheme,
  enableColorScheme,
  enableSystem,
  globalClassName,
  nonce,
  scriptProps,
  storageKey,
  value,
}: Readonly<{
  readonly attribute: 'class' | 'data-theme'
  readonly colorStorageKey: string
  readonly colorThemePrefix: string
  readonly defaultColorTheme: ColorTheme
  readonly defaultTheme: Theme
  readonly enableColorScheme: boolean
  readonly enableSystem: boolean
  readonly globalClassName: string
  readonly nonce?: string
  readonly scriptProps?: Omit<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    'dangerouslySetInnerHTML' | 'nonce'
  >
  readonly storageKey: string
  readonly value?: Record<string, string>
}>): React.JSX.Element {
  return (
    <script
      {...scriptProps}
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: generatePreHydrationScript({
          attribute,
          colorStorageKey,
          colorThemePrefix,
          defaultColorTheme,
          defaultTheme,
          enableColorScheme,
          enableSystem,
          globalClassName,
          storageKey,
          value,
        }),
      }}
    />
  )
})

ThemePreHydrationScript.displayName = 'ThemePreHydrationScript'
