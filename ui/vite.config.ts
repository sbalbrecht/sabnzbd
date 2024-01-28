import { ProxyOptions, defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react";

const server = "http://localhost:8080";

// These are paths that the Vite dev server will proxy to the SAB server. This is mostly used for
// API endpoints so the pages can fetch data.
// Paths corresponding to pages will be removed as those pages are migrated to this app.
const paths = [
  "/header",
  "/languages",
  "/translation",
  "/wizard/one",
  "/wizard/two",
  "/wizard/static",
  "/staticcfg",
  "/config",
];

const proxy: Record<string, string | ProxyOptions> = {};
paths.forEach(
  (p) =>
    (proxy[p] = {
      target: server,
      changeOrigin: true,
    }),
);

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
    proxy: proxy,
  },
});
