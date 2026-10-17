import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Served from https://gitudit.github.io/udit-portfolio/ (GitHub Pages sub-path).
export default defineConfig({
  base: "/udit-portfolio/",
  plugins: [react()],
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
    rollupOptions: {
      output: {
        // Keep the React runtime in a stable, separately cacheable chunk.
        manualChunks(id) {
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler")
          ) {
            return "react";
          }
        },
      },
    },
  },
  ssr: {
    // Bundle these CommonJS packages into the pre-render build so their default exports resolve
    // correctly under Node's ESM loader.
    noExternal: ["react-headroom", "emailjs-com", "email-validator"],
  },
});
