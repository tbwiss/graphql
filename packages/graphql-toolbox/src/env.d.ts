/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CONSOLE_BACKEND_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
