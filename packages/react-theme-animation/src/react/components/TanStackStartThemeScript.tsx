'use client'

import React from 'react'

import type { ColorTheme, SystemThemeMode, Theme } from '../../core/types'
import {
  COLOR_STORAGE_KEY,
  COLOR_THEME_PREFIX,
  GLOBAL_CLASS_NAME,
  STORAGE_KEY,
} from '../../tanstack/helpers'
import { serializeScriptValue } from './serialize-script-value'

export interface TanStackStartThemeScriptProps {
  readonly storageKey?: string
  readonly colorStorageKey?: string
  readonly defaultTheme?: Theme
  readonly defaultColorTheme?: ColorTheme
  readonly globalClassName?: string
  readonly colorThemePrefix?: string
  readonly nonce?: string
  readonly systemThemeMode?: SystemThemeMode
}

const generateTanStackPreHydrationScript = (
  storageKey: string,
  colorStorageKey: string,
  defaultTheme: Theme,
  defaultColorTheme: ColorTheme,
  globalClassName: string,
  colorThemePrefix: string,
  systemThemeMode: SystemThemeMode,
): string => {
  return `
(function() {
  try {
    var theme = localStorage.getItem(${serializeScriptValue(storageKey)}) || ${serializeScriptValue(defaultTheme)};
    var colorTheme = localStorage.getItem(${serializeScriptValue(colorStorageKey)}) || ${serializeScriptValue(defaultColorTheme)};
    var el = document.documentElement;
    var resolved;
    if (theme === 'system') {
      if (${serializeScriptValue(systemThemeMode)} === 'css') {
        el.classList.remove(${serializeScriptValue(globalClassName)});
        el.classList.remove('auto');
        el.classList.remove('system');
        el.classList.add('system');
        el.style.colorScheme = '';
      } else {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        if (resolved === 'dark') {
          el.classList.add(${serializeScriptValue(globalClassName)});
        } else {
          el.classList.remove(${serializeScriptValue(globalClassName)});
        }
        el.classList.remove('system');
        el.classList.remove('auto');
        el.style.colorScheme = resolved;
      }
    } else {
      resolved = theme;
      el.classList.remove('system');
      el.classList.remove('auto');
      if (resolved === 'dark') {
        el.classList.add(${serializeScriptValue(globalClassName)});
      } else {
        el.classList.remove(${serializeScriptValue(globalClassName)});
      }
      el.style.colorScheme = resolved;
    }
    if (colorTheme && colorTheme !== 'default') {
      el.classList.add(${serializeScriptValue(colorThemePrefix)} + colorTheme);
    }
  } catch (e) {
    console.warn('Theme pre-hydration script failed:', e);
  }
})();
`
}

export const TanStackStartThemeScript: React.FC<TanStackStartThemeScriptProps> =
  React.memo(function ({
    storageKey = STORAGE_KEY,
    colorStorageKey = COLOR_STORAGE_KEY,
    defaultTheme = 'system',
    defaultColorTheme = 'default',
    globalClassName = GLOBAL_CLASS_NAME,
    colorThemePrefix = COLOR_THEME_PREFIX,
    nonce,
    systemThemeMode = 'js',
  }: Readonly<TanStackStartThemeScriptProps>): React.JSX.Element {
    const scriptContent = generateTanStackPreHydrationScript(
      storageKey,
      colorStorageKey,
      defaultTheme,
      defaultColorTheme,
      globalClassName,
      colorThemePrefix,
      systemThemeMode,
    )

    return (
      <script
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: scriptContent }}
      />
    )
  })

TanStackStartThemeScript.displayName = 'TanStackStartThemeScript'
