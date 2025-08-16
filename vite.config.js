import { defineConfig } from "vite";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";
import handlebars from "vite-plugin-handlebars";

export default defineConfig({
    root: resolve(__dirname, "src"),

    base: "./",

    plugins: [
        tailwindcss(),
        handlebars({
            partialDirectory: resolve(__dirname, "src", "partials"),
        }),
    ],

    build: {
        outDir: resolve(__dirname, "dist"),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src", "index.html"),
            },
            output: {
                entryFileNames: "[name].js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name][extname]",
            },
        },
    },

    resolve: {
        alias: {
            "@": resolve(__dirname, "src"),
        },
    },
});
