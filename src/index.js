const rollup = require("rollup")
const fs = require("fs")

const inputOptions = {}

const outputOptions = {
  format: "es",
  plugins: [],
  assetFileNames: "assets/[name]-[hash][extname]",
  chunkFileNames: "[name]-[hash].js",
  compact: true,
  entryFileNames: "[name].js",
}

async function rollupBuild({inputOptions, outputOptions}) {
  const bundle = await rollup.rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)

  const manifestData = {};
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

const plugin = (snowpackConfig, pluginOptions) => {
  snowpackConfig.buildOptions.minify = false // Rollup will handle this

  return {
    name: "snowpack-plugin-rollup-bundle",
    input: ["*"],
    async optimize({ buildDirectory }) {
      const buildOptions = snowpackConfig.buildOptions || {};

      let extendConfig = (cfg) => cfg;
      if (typeof pluginOptions.extendConfig === "function") {
        extendConfig = pluginOptions.extendConfig;
      } else if (typeof pluginOptions.extendConfig === "object") {
        extendConfig = (cfg) => ({ ...cfg, ...pluginOptions.extendConfig });
      }

      const extendedConfig = extendConfig({
        ...snowpackConfig,
        outputOptions: {
          ...outputOptions,
          dir: buildDirectory
        },

        inputOptions: {
          ...inputOptions
        }
      })

      await rollupBuild(extendedConfig)
    }
  }
};

export default plugin;
