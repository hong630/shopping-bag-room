import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@netlify/remix-adapter/plugin";

export default defineConfig({
  server: {
    port:3000
  },
  plugins: [remix(), netlifyPlugin(), tsconfigPaths()],
});
