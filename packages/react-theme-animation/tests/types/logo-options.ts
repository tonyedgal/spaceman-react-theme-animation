import type { ThemeAnimationOptions } from '@space-man/react-theme-animation'

export const sizedLogo = {
  logo: '/logo.svg',
  logoWidth: 120,
  logoHeight: 'auto',
} satisfies ThemeAnimationOptions

export const pairedLogos = {
  logoLight: '/light.svg',
  logoDark: '/dark.svg',
  logoWidth: 'auto',
  logoHeight: 80,
} satisfies ThemeAnimationOptions

// @ts-expect-error Both destination assets must be supplied.
export const missingDark: ThemeAnimationOptions = {
  logoLight: '/light.svg',
}

// @ts-expect-error Both destination assets must be supplied.
export const missingLight: ThemeAnimationOptions = {
  logoDark: '/dark.svg',
}

// @ts-expect-error Single and paired assets are mutually exclusive.
export const mixedAssets: ThemeAnimationOptions = {
  logo: '/logo.svg',
  logoLight: '/light.svg',
  logoDark: '/dark.svg',
}

export const invalidDimension: ThemeAnimationOptions = {
  // @ts-expect-error Only auto is a supported string dimension.
  logoWidth: '100%',
}
