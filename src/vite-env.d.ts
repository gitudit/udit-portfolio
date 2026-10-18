/// <reference types="vite/client" />

// EmailJS identifiers. These are public client-side ids by design (see .env).
interface ImportMetaEnv {
  readonly VITE_serviceId: string;
  readonly VITE_templateId: string;
  readonly VITE_userId: string;
  /** Public site URL for canonical and Open Graph tags. */
  readonly VITE_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface WindowEventMap {
  "ride:theme": CustomEvent<"day" | "night">;
}
