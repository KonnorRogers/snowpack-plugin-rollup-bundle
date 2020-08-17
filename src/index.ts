import type { SnowpackPluginFactory } from "snowpack";
const rollup = require("rollup")

async function rollupBuild({inputOptions, outputOptions}) {
  const bundle = await rollup.rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      // assets
    } else {
     // chunks
    }
  }

  await bundle.write(outputOptions)
}

const plugin: SnowpackPluginFactory = (config, options) => {
  config.buildOptions.minify = false // Rollup will handle this

  return {
    name: "snowpack-plugin-rollup-bundle",
    input: ["*"],
    async optimize({ buildDirectory }) {

    }
  }
};

export default plugin;
