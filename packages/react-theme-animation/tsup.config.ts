import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'react/index': 'src/react/index.ts',
    'tanstack/index': 'src/tanstack/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: true,
  treeshake: true,
  minify: true,
  external: [
    'react',
    'react-dom',
    'motion',
    'motion/react',
    '@radix-ui/react-select',
  ],
})
