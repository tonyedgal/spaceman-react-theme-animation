import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import {
  buildServerThemeData,
  COLOR_STORAGE_KEY,
  STORAGE_KEY,
  type ServerThemeData,
} from '@space-man/react-theme-animation'
import { z } from 'zod'

export const getThemeServerFn = createServerFn().handler(
  (): ServerThemeData =>
    buildServerThemeData(getCookie(STORAGE_KEY), getCookie(COLOR_STORAGE_KEY))
)

export const setThemeServerFn = createServerFn()
  .inputValidator(z.string())
  .handler(({ data }) => {
    setCookie(STORAGE_KEY, data)
  })

export const setColorThemeServerFn = createServerFn()
  .inputValidator(z.string())
  .handler(({ data }) => {
    setCookie(COLOR_STORAGE_KEY, data)
  })
