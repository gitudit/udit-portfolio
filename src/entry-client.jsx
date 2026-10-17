import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");

// Production HTML is pre-rendered at build time (see scripts/prerender.mjs), so we hydrate.
// The dev server serves an empty root, so we fall back to a normal client render.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />, {
    // Surface hydration mismatches in every environment; they indicate server/client markup drift.
    onRecoverableError(error, info) {
      console.error("[hydration]", error, info && info.componentStack);
    },
  });
} else {
  createRoot(container).render(<App />);
}
