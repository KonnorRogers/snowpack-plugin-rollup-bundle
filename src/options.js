const path = require("path");
// plugins
import alias from "@rollup/plugin-alias";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
import url from "@rollup/plugin-url";

export function defaultInputOptions(buildDirectory) {
  return {
    plugins: [
      postcss({
        extract: path.resolve(buildDirectory, "css"),
        modules: true,
        minimize: true,
        sourceMap: true,
      }),
      url({
        include: "**/*",
        exclude: "**/*.(js|json|css)",
        destDir: path.resolve(buildDirectory, "assets"),
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
    plugins: [terser()],
    assetFileName: "assets/[name].[hash][ext]",
    chunkFileNames: "chunks/[name].[hash].js",
    compact: true,
    entryFileNames: "entrypoints/[name].[hash].js",
    dir: buildDirectory,
  };
}
