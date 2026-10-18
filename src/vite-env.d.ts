/// <reference types="vite/client" />

// EmailJS identifiers. These are public client-side ids by design (see .env).
interface ImportMetaEnv {
  readonly VITE_serviceId: string;
  readonly VITE_templateId: string;
  readonly VITE_userId: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface WindowEventMap {
  "ride:theme": CustomEvent<"day" | "night">;
}
