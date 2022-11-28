import { defineConfig } from "vite";
import nodePolyfills from "rollup-plugin-polyfill-node";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        "process.env": process.env || {},
    },
    plugins: [react()],
    server: {
        port: 9095,
    },
    base: "./",
    build: {
        rollupOptions: {
            plugins: [nodePolyfills({ include: null })],
        },
    },
});
