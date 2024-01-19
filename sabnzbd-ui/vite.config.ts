import { ProxyOptions, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = 'http://localhost:8080';

const paths = [
  '/header',
  '/languages',
  '/localization',
  '/wizard/one',
  '/wizard/two',
  '/staticcfg',
];

const proxy: Record<string, string | ProxyOptions> = {};
paths.forEach(p => proxy[p] = {
  target: base,
  changeOrigin: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: proxy
  }
})
