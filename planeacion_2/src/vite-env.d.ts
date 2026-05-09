/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_USE_MOCK?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'react-cytoscapejs';
declare module 'cytoscape-cose-bilkent';
declare module 'cytoscape-navigator';
declare module 'cytoscape-popper';
