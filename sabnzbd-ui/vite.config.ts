import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = 'http://localhost:8080';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/header': {
        target: `${base}`,
        changeOrigin: true,
      },
      '/languages': {
        target: `${base}`,
        changeOrigin: true,
      },
      '/localization': {
        target: `${base}`,
        changeOrigin: true,
      },
      '/wizard': {
        target: `${base}`,
        changeOrigin: true,
      },
      '/staticcfg': {
        target: `${base}`,
        changeOrigin: true,
      },
    }
  }
})
