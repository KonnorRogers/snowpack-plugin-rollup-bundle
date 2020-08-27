const rollup = require("rollup");
const fs = require("fs");
const path = require("path");
// import { proxyImportResolver } from "./proxyImportResolve"

import { defaultInputOptions, defaultOutputOptions } from "./options";

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const manifestData = {};
  manifestData.entrypoints = {};
  const buildDirectory = outputOptions.dir;

  for (const chunkOrAsset of output) {
    const fileName = chunkOrAsset.fileName;
    manifestData[fileWithoutHash(fileName)] = fileName;

    if (chunkOrAsset.type == "asset") {
      //
    } else {
      if (chunkOrAsset.isEntry) {
        // turns into
        // entrypoints: { origFileName: { js: hashedFileName }}
        Object.assign(manifestData.entrypoints, {
          [chunkOrAsset.name]: { js: fileName },
        });

        // delete original file
        fs.unlinkSync(fileWithoutHash(fileName))
      }
    }
  }

  const manifestJSON = JSON.stringify(manifestData, null, 2);
  fs.writeFileSync(path.resolve(buildDirectory, "manifest.json"), manifestJSON);
  await bundle.write(outputOptions);
}

function fileWithoutHash(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/\.\d*\./, ".");
  return path.join(dir, fileWithoutHash);
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
