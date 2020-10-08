import rollup from "rollup";
import fs from "fs";
import path from "path";
import glob from "glob";
import os from "os";

import { defaultInputOptions, defaultOutputOptions } from "./options";
import { shellRun } from "./utils";
import { proxyImportResolver } from "./proxyImportResolver";
import { addToManifest } from "./manifestUtils";
import { emitHtmlFiles } from "./emitHtmlFiles";

const TMP_BUILD_DIRECTORY = path.join(os.tmpdir(), "build");

function getEntrypoints(entrypoints) {
  if (typeof entrypoints === "string") {
    return glob.sync(entrypoints);
  }

  return entrypoints;
}

async function rollupBuild({ pluginOptions, inputOptions, outputOptions }) {
  const TMP_DEBUG_DIRECTORY = path.join(os.tmpdir(), "_source_");

  const entrypoints = getEntrypoints(pluginOptions.entrypoints);

  inputOptions.input = inputOptions.input || entrypoints;

  const buildDirectory = outputOptions.dir;
  outputOptions.dir = TMP_BUILD_DIRECTORY;

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  const manifest = {};

  for (const chunkOrAsset of output) {
    console.log(chunkOrAsset);
    if (chunkOrAsset.isEntry || chunkOrAsset.type === "asset") {
      addToManifest({ manifest, chunkOrAsset, assignTo: "entrypoints" });
      continue;
    }

    addToManifest({ manifest, chunkOrAsset, assignTo: "chunks" });
  }

  await bundle.write(outputOptions);

  // Add assets to manifest, use path.relative to fix minor issues
  glob.sync(`${TMP_BUILD_DIRECTORY}/images/**/*.*`).forEach((fileName) => {
    fileName = path.relative(TMP_BUILD_DIRECTORY, fileName);
    const chunkOrAsset = { fileName, map: null };
    addToManifest({
      manifest,
      chunkOrAsset,
      assignTo: "images",
      useFileType: false,
    });
  });

  const manifestJSON = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(
    path.join(TMP_BUILD_DIRECTORY, "manifest.json"),
    manifestJSON
  );

  if (pluginOptions.emitHtml === true) {
    glob.sync(buildDirectory + "**/*.html").forEach((file) => {
      let destFile = path.relative(buildDirectory, file);
      destFile = path.join(TMP_BUILD_DIRECTORY, destFile);
      emitHtmlFiles({ file, manifest, destFile });
    });
  }

  shellRun(`rm -rf ${TMP_DEBUG_DIRECTORY} && mkdir -p ${TMP_DEBUG_DIRECTORY}`);
  shellRun(`mv ${buildDirectory} ${TMP_DEBUG_DIRECTORY}`);
  shellRun(`mv ${TMP_BUILD_DIRECTORY} ${buildDirectory}`);

  if (pluginOptions.preserveSourceFiles === true) {
    const buildDebugDir = path.join(buildDirectory, "_source_");
    shellRun(`mv ${TMP_DEBUG_DIRECTORY}/ ${buildDebugDir}`);
  }
}

const plugin = (snowpackConfig, pluginOptions = {}) => {
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
        pluginOptions: {
          ...pluginOptions,
        },
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
