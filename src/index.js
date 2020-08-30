const rollup = require("rollup");
const fs = require("fs");
const path = require("path");
// const glob = require("glob");

import { defaultInputOptions, defaultOutputOptions } from "./options";
// import { generateManifestData, generateManifestFile } from "./generateManifest";

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const manifestData = {}

  for(const chunkOrAsset of output) {
    const fileName = chunkOrAsset.fileName
    if (chunkOrAsset.type === "asset") {
      //
    } else {
      //
    }
    manifestData[fileName] = fileName
  }


  const buildDirectory = outputOptions.dir;
  const manifestJSON = JSON.stringify(manifestData, null, 2)
  await bundle.write(outputOptions);
  fs.writeFileSync(path.join(buildDirectory, "manifest.json"), manifestJSON)
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
