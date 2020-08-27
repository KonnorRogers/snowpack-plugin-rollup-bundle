const rollup = require("rollup");
// const fs = require("fs");
// const path = require("path");

// import { proxyImportResolver } from "./proxyImportResolver";
import { defaultInputOptions, defaultOutputOptions } from "./options";
// import { generateManifestData, generateManifestFile } from "./generateManifest"

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const buildDirectory = outputOptions.dir;

  // generateManifestData({buildDirectory: buildDirectory, b})

  for (const chunkOrAsset of output) {
    console.log(chunkOrAsset);
    // const fileName = chunkOrAsset.fileName;
    // manifestData[fileWithoutHash(fileName)] = fileName;

    if (chunkOrAsset.type == "asset") {
      //
    } else {
      // chunkOrAsset.code = proxyImportResolver(chunkOrAsset.code);
      if (chunkOrAsset.isEntry) {
        // Object.assign(manifestData.entrypoints, {
        //   [chunkOrAsset.name]: { js: fileName },
        // });
      }
    }
  }

  const manifestJSON = JSON.stringify(manifestData, null, 2);
  fs.writeFileSync(path.resolve(buildDirectory, "manifest.json"), manifestJSON);
  await bundle.write(outputOptions);
}

// function fileWithoutHash(filePath) {
//   const { dir, base } = path.parse(filePath);

//   const fileWithoutHash = base.replace(/\..*\./, ".");
//   return path.join(dir, fileWithoutHash);
// }

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
