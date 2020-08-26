const path = require("path");
// plugins
import alias from "@rollup/plugin-alias";
import css from "rollup-plugin-css-only";
// import image from "@rollup/plugin-image";
import { terser } from "rollup-plugin-terser";

export function defaultInputOptions(buildDirectory) {
  return {
    plugins: [
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
    plugins: [terser()],
    assetFileNames: "[name].[extname]",
    chunkFileNames: "[name].js",
    compact: true,
    entryFileNames: "[name].js",
    dir: buildDirectory,
  };
}
