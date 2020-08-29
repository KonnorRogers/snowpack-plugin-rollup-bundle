const path = require("path");
// plugins
import alias from "@rollup/plugin-alias";
import css from "rollup-plugin-css-only";
import url from "@rollup/plugin-url";
import { terser } from "rollup-plugin-terser";

export function defaultInputOptions(buildDirectory) {
  return {
    plugins: [
      css({
        output: "bundle.css",
      }),
      url({
        fileName: "[name].[hash][extname]",
        publicPath: buildDirectory,
        include: "**/*",
        exclude: ["**/*.js", "**/*.json", "**/*.css"],
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

export function defaultOutputOptions(
  buildDirectory,
  { chunkPath = "chunks", packPath = "packs" }
) {
  return {
    format: "es",
    plugins: [terser()],
    chunkFileNames: `${chunkPath}/[name].[hash].js`,
    compact: true,
    entryFileNames: `${packPath}/[name].[hash].js`,
    dir: buildDirectory,
  };
}
