import { StrictMode } from "react";
import { createRoot, hydrateRoot, type RootOptions } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");

const options: RootOptions = {
  onRecoverableError(error, info) {
    console.error("[hydration]", error, info.componentStack);
  },
  onUncaughtError(error, info) {
    console.error("[uncaught]", error, info.componentStack);
  },
  onCaughtError(error, info) {
    console.error("[caught]", error, info.componentStack);
  },
};

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Production HTML is pre-rendered at build time (scripts/prerender.mjs), so we hydrate.
// The dev server serves an empty root, so we render normally there.
if (container.hasChildNodes()) hydrateRoot(container, app, options);
else createRoot(container, options).render(app);
