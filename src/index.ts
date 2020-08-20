import { rollup, InputOption, OutputOptions } from 'rollup';
import type { SnowpackPluginFactory } from "snowpack";

const fs = require("fs")

interface RollupBuild {
  inputOptions: InputOption;
  outputOptions: OutputOptions;
}

interface ManifestData {
  [fileName: string]: string;
}

const inputOptions: InputOption = {}

const outputOptions: OutputOptions = {
  format: "es",
  plugins: [],
  assetFileNames: "assets/[name]-[hash][extname]",
  chunkFileNames: "[name]-[hash].js",
  compact: true,
  entryFileNames: "[name].js",
}

async function rollupBuild({inputOptions, outputOptions}: RollupBuild) {
  const bundle = await rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)

  const manifestData: ManifestData = {};
  for (const chunkOrAsset of output) {
    const fileName = chunkOrAsset.fileName;
    let name;

    if (chunkOrAsset.type === "asset") {
      name = chunkOrAsset.source;
    } else {
      name = chunkOrAsset.name
    }

    manifestData[name] = fileName;
  }

  await bundle.write(outputOptions)
  const manifestJSON = JSON.stringify(manifestData);
  await fs.write(manifestJSON)
}

const plugin: SnowpackPluginFactory = (config, options) => {
  config.buildOptions.minify = false // Rollup will handle this

  return {
    name: "snowpack-plugin-rollup-bundle",
    input: ["*"],
    async optimize({ buildDirectory }) {
      const buildOptions = config.buildOptions || {};
      let baseUrl = buildOptions.baseUrl || "/";

      let extendConfig = (cfg) => cfg;
      if (typeof options.extendConfig === "function") {
        extendConfig = options.extendConfig;
      } else if (typeof options.extendConfig === "object") {
        extendConfig = (cfg) => ({ ...cfg, ...options.extendConfig });
      }

      const extendedConfig = extendConfig({
        outputOptions: {
          ...outputOptions,
          dir: `${buildDirectory}/manifest.json`
        },

        inputOptions: {
          ...inputOptions
        }
      })

      rollupBuild(extendedConfig)
    }
  }
};

export default plugin;
