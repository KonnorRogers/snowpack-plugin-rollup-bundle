const rollup = require("rollup");
const fs = require("fs");
const path = require("path");

// plugins
import alias from "@rollup/plugin-alias";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import styles from "rollup-plugin-styles";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import multi from "@rollup/plugin-multi-entry";
import { terser } from "rollup-plugin-terser";

const defaultInputOptions = (buildDirectory) => {
  return {
    input: `${buildDirectory}/**/*`,
    plugins: [
      nodeResolve(),
      commonjs(),
      image(),
      json(),
      styles({
        mode: "extract",
      }),
      multi(),
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
};

const defaultOutputOptions = (buildDirectory) => {
  return {
    format: "es",
    plugins: [terser()],
    assetFileNames: "assets/[name].[hash][extname]",
    chunkFileNames: "[name].[hash].js",
    compact: true,
    entryFileNames: "[name].[hash].js",
    dir: buildDirectory,
  };
};

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  const manifestData = {};
  for (const chunkOrAsset of output) {
    const fileName = chunkOrAsset.fileName;
    let name;

    if (chunkOrAsset.type === "asset") {
      name = chunkOrAsset.source;
    } else {
      name = `${chunkOrAsset.name}.js`;
    }

    manifestData[name] = fileName;
  }

  await bundle.write(outputOptions);
  const manifestJSON = JSON.stringify(manifestData);

  // Object.keys(manifestData).forEach((file) => {
  //   fs.unlinkSync(path.resolve(file));
  // });

  if (!fs.existsSync(outputOptions.dir)) {
    fs.mkdirSync(outputOptions.dir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(outputOptions.dir, "manifest.json"),
    manifestJSON
  );
}

const plugin = (snowpackConfig, pluginOptions) => {
  snowpackConfig.buildOptions.minify = false; // Let rollup handle this
  snowpackConfig.buildOptions.clean = true;
  return {
    name: "snowpack-plugin-rollup-bundle",
    async optimize({ buildDirectory }) {
      const inputOptions = defaultInputOptions(buildDirectory);
      const outputOptions = defaultOutputOptions(buildDirectory);

      let extendConfig = (cfg) => cfg;
      if (typeof pluginOptions.extendConfig === "function") {
        extendConfig = pluginOptions.extendConfig;
      } else if (typeof pluginOptions.extendConfig === "object") {
        extendConfig = (cfg) => ({ ...cfg, ...pluginOptions.extendConfig });
      }

      const extendedConfig = await extendConfig({
        ...snowpackConfig,
        inputOptions: {
          ...inputOptions,
        },
        outputOptions: {
          ...outputOptions,
        },
      });

      await rollupBuild(extendedConfig);
    },
  };
};

export default plugin;
