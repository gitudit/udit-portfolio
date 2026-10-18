import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://gitudit.github.io/udit-portfolio/ (GitHub Pages sub-path).
export default defineConfig({
  base: "/udit-portfolio/",
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
