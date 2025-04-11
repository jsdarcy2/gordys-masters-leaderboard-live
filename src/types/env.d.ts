
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SPORTS_API_KEY: string;
  readonly VITE_TOURNAMENT_YEAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
