import { fileURLToPath, URL } from 'url'

import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [devtools(), netlify(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config
