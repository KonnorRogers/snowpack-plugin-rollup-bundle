const rollup = require("rollup");
const fs = require("fs");
const path = require("path");

import { defaultInputOptions, defaultOutputOptions } from "./options";
import { generateManifest } from "./generateManifest";

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
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

      const manifest = generateManifest(buildDirectory);
      const manifestJSON = JSON.stringify(manifest);
      fs.writeFileSync(
        path.resolve(buildDirectory, "manifest.json"),
        manifestJSON
      );
      console.log(manifestJSON);
      await rollupBuild(extendedConfig);
    },
  };
};

export default plugin;
