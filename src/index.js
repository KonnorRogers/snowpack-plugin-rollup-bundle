const rollup = require("rollup");
// const fs = require("fs");
// const path = require("path");
import { proxyImportResolver } from "./proxyImportResolve"

import { defaultInputOptions, defaultOutputOptions } from "./options";
// import { generateManifestData, generateManifestFile } from "./generateManifest";

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      //
    } else {
      console.log(chunkOrAsset.name);
      chunkOrAsset.code
    }
  }
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

      await rollupBuild(extendedConfig);

      // const buildDir = extendedConfig.outputOptions.dir;
      // const manifestData = generateManifestData(buildDir);

      // generateManifestFile({
      //   buildDirectory: buildDir,
      //   manifestData: manifestData,
      // });
    },
  };
};

export default plugin;
