const path = require("path");
// plugins
import alias from "@rollup/plugin-alias";
import css from "rollup-plugin-css-only";
import sizes from "rollup-plugin-sizes";
import image from "@rollup/plugin-image";
import { terser } from "rollup-plugin-terser";

export function defaultInputOptions(buildDirectory) {
  return {
    plugins: [
      image(),
      css({
        output: "bundle.css",
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
    plugins: [terser(), sizes()],
    assetFileNames: "assets/[name].[hash].[extname]",
    chunkFileNames: "chunks/[name].[hash].js",
    compact: true,
    entryFileNames: "packs/[name].[hash].js",
    dir: buildDirectory,
  };
}
