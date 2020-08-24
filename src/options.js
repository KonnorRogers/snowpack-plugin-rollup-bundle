const path = require("path");
// plugins
import alias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

export function defaultInputOptions(buildDirectory) {
  return {
    plugins: [
      nodeResolve(),
      commonjs(),
      image(),
      json(),
      postcss({
        minimize: true,
        extract: true,
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
    assetFileNames: "assets/[name].[hash][extname]",
    chunkFileNames: "packs/[name].[hash].js",
    compact: true,
    entryFileNames: "packs/[name].[hash].js",
    dir: buildDirectory,
  };
}
