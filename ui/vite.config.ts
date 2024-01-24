import { ProxyOptions, defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin' 
import { lingui } from "@lingui/vite-plugin";
import react from '@vitejs/plugin-react'

const base = 'http://localhost:8080';

const paths = [
  '/header',
  '/languages',
  '/translation',
  '/wizard/one',
  '/wizard/two',
  '/staticcfg',
  '/config',
];

const proxy: Record<string, string | ProxyOptions> = {};
paths.forEach(p => proxy[p] = {
  target: base,
  changeOrigin: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["macros"],
      },
    }),
    lingui(),
    TanStackRouterVite(),
  ],
  server: {
    proxy: proxy
  }
})
