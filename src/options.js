const path = require("path");

// plugins
import alias from "@rollup/plugin-alias";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import url from "@rollup/plugin-url";

export function defaultInputOptions({ buildDirectory, tmpDir }) {
  return {
    plugins: [
      postcss({
        extract: true,
        modules: true,
      }),
      url({
        include: "**/*",
        exclude: "**/*.(js|json|css)",
        destDir: path.resolve(tmpDir, "assets"),
        limit: 0, // extract all files
        fileName: "[name].[hash][extname]",
      }),
      alias({
        entries: [
          {
            find: "/__snowpack__",
            replacement: path.relative(buildDirectory, "__snowpack__"),
          },
          {
            find: "/web_modules",
            replacement: path.relative(buildDirectory, "web_modules"),
          },
        ],
      }),
    ],
  };
}

export function defaultOutputOptions(buildDirectory) {
  return {
    format: "es",
    plugins: [
      terser(),
    ],
    assetFileNames: "assets/[name].[hash][ext]",
    chunkFileNames: "chunks/[name].[hash].js",
    compact: true,
    entryFileNames: "entrypoints/[name].[hash].js",
    dir: buildDirectory,
  };
}
