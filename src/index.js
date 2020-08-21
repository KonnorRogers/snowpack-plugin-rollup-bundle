const rollup = require("rollup");
const fs = require("fs");
const path = require("path");

const inputOptions = {};

const outputOptions = {
  format: "es",
  plugins: [],
  assetFileNames: "assets/[name].[hash][extname]",
  chunkFileNames: "[name].[hash].js",
  compact: true,
  entryFileNames: "[name].[hash].js",
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

  Object.keys(manifestData).forEach((file) => {
    fs.unlinkSync(path.resolve(outputOptions.dir, file));
  });

  if (!fs.existsSync(outputOptions.dir)) {
    fs.mkdirSync(outputOptions.dir, { recursive: true });
  }

  fs.writeFileSync(
    path.resolve(outputOptions.dir, "manifest.json"),
    manifestJSON
  );
}

const plugin = (snowpackConfig, pluginOptions) => {
  return {
    name: "snowpack-plugin-rollup-bundle",
    input: ["*"],
    async optimize({ buildDirectory }) {
      let extendConfig = (cfg) => cfg;
      if (typeof pluginOptions.extendConfig === "function") {
        extendConfig = pluginOptions.extendConfig;
      } else if (typeof pluginOptions.extendConfig === "object") {
        extendConfig = (cfg) => ({ ...cfg, ...pluginOptions.extendConfig });
      }

      const extendedConfig = await extendConfig({
        ...snowpackConfig,
        outputOptions: {
          ...outputOptions,
          dir: buildDirectory,
        },

        inputOptions: {
          ...inputOptions,
          input: fs.readdirSync(buildDirectory),
        },
      });

      await rollupBuild(extendedConfig);
    },
  };
};

export default plugin;
