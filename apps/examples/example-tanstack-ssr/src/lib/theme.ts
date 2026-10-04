import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

import {
  buildServerThemeData,
  COLOR_STORAGE_KEY,
  STORAGE_KEY,
  type ServerThemeData,
} from '@space-man/react-theme-animation'

export const getThemeServerFn = createServerFn().handler((): ServerThemeData =>
  buildServerThemeData(getCookie(STORAGE_KEY), getCookie(COLOR_STORAGE_KEY)),
)

export const setThemeServerFn = createServerFn()
  .validator(z.string())
  .handler(({ data }) => {
    setCookie(STORAGE_KEY, data)
  })

export const setColorThemeServerFn = createServerFn()
  .validator(z.string())
  .handler(({ data }) => {
    setCookie(COLOR_STORAGE_KEY, data)
  })
