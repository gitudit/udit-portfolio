import { prerender } from "react-dom/static";
import App from "./App";

// Used only at build time by scripts/prerender.mjs to produce static HTML for build/index.html.
// `prerender` waits for every Suspense boundary that can resolve at build time, unlike renderToString.
export async function render(): Promise<string> {
  const { prelude } = await prerender(<App />);
  return new Response(prelude).text();
}
