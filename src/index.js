import rollup from "rollup";
import fs from "fs";
import path from "path";
import glob from "glob";
import os from "os";

import { defaultInputOptions, defaultOutputOptions } from "./options";
import { shellRun, addToManifestData, addToManifestEntrypoint } from "./utils";
import { proxyImportResolver } from "./proxyImportResolver";

const TMP_BUILD_DIRECTORY = path.join(os.tmpdir(), "build");

async function rollupBuild({ inputOptions, outputOptions }) {
  const buildDirectory = outputOptions.dir;
  outputOptions.dir = TMP_BUILD_DIRECTORY;

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);
  const manifestData = {};

  for (const chunkOrAsset of output) {
    let fileName = chunkOrAsset.fileName;
    addToManifestData({ manifestData, fileName });
    addToManifestEntrypoint({ manifestData, fileName });

    if (chunkOrAsset !== "asset") {
      fileName += ".map";
      addToManifestData({ manifestData, fileName });
      addToManifestEntrypoint({ manifestData, fileName });
    }
  }

  await bundle.write(outputOptions);

  shellRun(`rm -rf ${buildDirectory}`);
  shellRun(`mv ${TMP_BUILD_DIRECTORY} ${buildDirectory}`);

  // Add assets to manifest, use path.relative to fix minor issues
  glob.sync(`${buildDirectory}/assets/**/*.*`).forEach((fileName) => {
    fileName = path.relative(buildDirectory, fileName);
    addToManifestData({ manifestData, fileName });
  });

  const manifestJSON = JSON.stringify(manifestData, null, 2);
  fs.writeFileSync(path.join(buildDirectory, "manifest.json"), manifestJSON);
}

const plugin = (snowpackConfig, pluginOptions) => {
  snowpackConfig.buildOptions.minify = false; // Let rollup handle this
  snowpackConfig.buildOptions.clean = true;
  return {
    name: "snowpack-plugin-rollup-bundle",
    async optimize({ buildDirectory }) {
      const inputOptions = defaultInputOptions({
        buildDirectory,
        tmpDir: TMP_BUILD_DIRECTORY,
      });
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

      // Rewrite "proxy.js" imports prior to building
      glob.sync(buildDirectory + "/**/*.js").forEach((file) => {
        const resolvedImports = proxyImportResolver(
          fs.readFileSync(file, "utf8")
        );
        fs.writeFileSync(file, resolvedImports, "utf8");
      });

      await rollupBuild(extendedConfig);
    },
  };
};

export default plugin;
