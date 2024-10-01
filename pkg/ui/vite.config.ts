import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
// @ts-ignore
import { peerDependencies } from "./package.json";
// @ts-ignore
import path from "path";

export default defineConfig({
    build: {
        lib: {
            entry: "./src/index.ts", // Specifies the entry point for building the library.
            name: "ui", // Sets the name of the generated library.
            fileName: (format) => `index.${format}.js`, // Generates the output file name based on the format.
            formats: ["cjs", "es"], // Specifies the output formats (CommonJS and ES modules).
        },
        rollupOptions: {
            external: [...Object.keys(peerDependencies)], // Defines external dependencies for Rollup bundling.
        },
        sourcemap: true, // Generates source maps for debugging.
        emptyOutDir: true, // Clears the output directory before building.
    },
    plugins: [dts()],
    // Uses the 'vite-plugin-dts' plugin for generating TypeScript declaration files (d.ts).
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
        },
    },
});