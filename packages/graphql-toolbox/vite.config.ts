import { defineConfig } from "vite";
import nodePolyfills from "rollup-plugin-polyfill-node";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
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
    resolve: {
        alias: {
            path: "path-browserify",
            process: "process/browser",
            stream: "stream-browserify",
            zlib: "browserify-zlib",
            util: "util/",
            buffer: "buffer/",
        },
    },

    optimizeDeps: {
        include: ["@neo4j/graphql", "@neo4j/introspector"],
    },
    build: {
        rollupOptions: {
            plugins: [nodePolyfills({ include: null })],
        },
    },
});
