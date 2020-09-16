import path from "path";

// plugins
import resolve from "@rollup/plugin-node-resolve";
import styles from "rollup-plugin-styles";
import { terser } from "rollup-plugin-terser";
import url from "@rollup/plugin-url";

export function defaultInputOptions({ buildDirectory, tmpDir }) {
  return {
    plugins: [
      resolve({ browser: true }),
      styles({
        mode: ["extract"],
        modules: true,
        autoModules: (id) => id.includes(".module.css"),
        sourceMap: true,
        minimize: true,
      }),
      url({
        include: "**/*",
        exclude: "**/*.(js|json|css)",
        sourceDir: path.resolve(buildDirectory, "assets"),
        destDir: path.resolve(tmpDir, "assets"),
        publicPath: path.resolve(tmpDir, "assets"),
        limit: 0, // extract all files
        fileName: "[dirname][name]-[hash][extname]",
      }),
    ],
  };
}

export function defaultOutputOptions(buildDirectory) {
  return {
    format: "es",
    plugins: [terser()],
    manualChunks: (id) => {
      if (id.includes("web_modules")) {
        return path.parse(id).name;
      }
    },
    assetFileNames: "css/[name]-[hash].[ext]",
    chunkFileNames: "chunks/[name]-[hash].chunk.js",
    compact: true,
    sourcemap: true,
    entryFileNames: "entrypoints/[name]-[hash].js",
    dir: buildDirectory,
  };
}
