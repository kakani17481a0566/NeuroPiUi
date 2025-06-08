import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import eslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import tailwindcss from "@tailwindcss/vite"
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    svgr(),
    eslint(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      components: path.resolve(__dirname, 'src/components'), // Optional
    },
  },
})
