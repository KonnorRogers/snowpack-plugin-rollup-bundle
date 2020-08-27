const rollup = require("rollup");
// const fs = require("fs");
// const path = require("path");
// const glob = require("glob");

// import { proxyImportResolver } from "./proxyImportResolver";
import { defaultInputOptions, defaultOutputOptions } from "./options";
import { generateManifestData, generateManifestFile } from "./generateManifest";

async function rollupBuild({ inputOptions, outputOptions }) {
  const bundle = await rollup.rollup(inputOptions);
  // const { output } = await bundle.generate(outputOptions);
  await bundle.generate(outputOptions);
  const buildDirectory = outputOptions.dir;

  const manifestData = generateManifestData(buildDirectory);
  generateManifestFile({ buildDirectory, manifestData });

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

      // const pattern = buildDirectory + "/**/**";
      // const filesToResolve = glob.sync(pattern).filter((file) => {
      //   return fs.statSync(file).isFile();
      // });
      // filesToResolve.forEach((file) => {
      //   const fileContent = fs.readFileSync(file, { encoding: "utf-8" });
      //   fs.writeFileSync(file, proxyImportResolver(fileContent));
      // });

      await rollupBuild(extendedConfig);
    },
  };
};

export default plugin;
