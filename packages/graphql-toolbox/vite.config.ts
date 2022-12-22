import { defineConfig } from "vite";
import nodePolyfills from "rollup-plugin-polyfill-node";
// import { nodeResolve } from "@rollup/plugin-node-resolve";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        "process.env": process.env || {},
    },
    plugins: [react()],
    server: {
        port: 4141,
    },
    base: "./",
    esbuild: {
        target: "es2021",
    },
    build: {
        rollupOptions: {
            plugins: [nodePolyfills({ include: null })],
        },
        target: "es2021",
    },
});
