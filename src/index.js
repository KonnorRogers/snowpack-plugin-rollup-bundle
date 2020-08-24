const rollup = require("rollup");
const fs = require("fs");
const path = require("path");

import { defaultInputOptions, defaultOutputOptions } from "./options";
// import { generateManifest } from "./generateManifest";

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const manifestData = {};
  for (const chunkOrAsset of output) {
    console.log(path.parse(chunkOrAsset.fileName));
  }

  const manifestJSON = JSON.stringify(manifestData);
  if (!fs.existsSync(outputOptions.dir)) {
    fs.mkdirSync(outputOptions.dir, {recursive: true});
  }
  fs.writeFileSync(
    path.resolve(outputOptions.dir, "manifest.json"),
    manifestJSON
  );

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

      // const manifest = generateManifest(buildDirectory);
      // const manifestJSON = JSON.stringify(manifest);
      // fs.writeFileSync(
      //   path.resolve(buildDirectory, "manifest.json"),
      //   manifestJSON
      // );

      const extendedConfig = await extendConfig({
        ...snowpackConfig,
        inputOptions: {
          ...inputOptions,
        },
        outputOptions: {
          ...outputOptions,
        },
      });

      // const input = extendedConfig.inputOptions.input;
      // extendedConfig.inputOptions.input = hashedInputs(input, manifest);

      await rollupBuild(extendedConfig);
    },
  };
};

// function hashedInputs(inputs, manifest) {
//   if (inputs == null) {
//     throw "No inputs given";
//   }
//   if (Array.isArray(inputs)) {
//     return inputs.map((file) => manifest[file]);
//   }
//   if (typeof inputs === "object") {
//     return;
//   }
//   return;
// }

export default plugin;
