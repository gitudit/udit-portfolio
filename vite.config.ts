/// <reference types="node" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://gitudit.github.io/udit-portfolio/ by default. For a custom domain the deploy
// helper (scripts/deploy.mjs --domain …) sets SITE_BASE=/ and VITE_SITE_URL.
export default defineConfig({
  base: process.env.SITE_BASE ?? "/udit-portfolio/",
  // React Compiler (Oxc port) memoises components and hooks automatically.
  plugins: [react({ compiler: true })],
  build: {
    outDir: "build",
    emptyOutDir: true,
    sourcemap: false,
    // Small images become data: URIs; fonts always stay separate files so the <link rel="preload">
    // tags in index.html point at real assets.
    assetsInlineLimit: (filePath, content) => {
      if (/\.(woff2?|ttf|otf)$/.test(filePath)) return false;
      return content.length < 4096;
    },
    rolldownOptions: {
      output: {
        // Keep the React runtime in a stable, separately cacheable chunk.
        codeSplitting: {
          groups: [{ name: "react", test: /node_modules[\\/](react|react-dom|scheduler|use-sync-external-store)[\\/]/ }],
        },
      },
    },
  },
  ssr: {
    // Bundle these CommonJS packages into the pre-render build so their exports resolve
    // correctly under Node's ESM loader.
    noExternal: ["@emailjs/browser", "email-validator", "use-sync-external-store"],
  },
});
