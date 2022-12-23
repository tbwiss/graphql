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
        port: 4242,
    },
    base: "./",
    // resolve: {
    //     alias: {
    //         "@neo4j/graphql": path.resolve(__dirname, "../graphql/src/index.ts"),
    //         // '/@linked/my-shared-components/': path.dirname(require.resolve('my-shared-components/src/index.ts'))
    //     },
    // },
    optimizeDeps: {
        include: ["@neo4j/graphql", "@neo4j/introspector"],
    },
    build: {
        rollupOptions: {
            plugins: [nodePolyfills({ include: null })],
        },
    },
});
