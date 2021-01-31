import rollup from "rollup";
import fs from "fs-extra";
import path from "path";
import glob from "glob";
import os from "os";

import { defaultInputOptions, defaultOutputOptions } from "./options";
import { proxyImportResolver } from "./proxyImportResolver";
import { addToManifest } from "./manifestUtils";
import { emitHtmlFiles } from "./emitHtmlFiles";
import { pathToUnix } from "./utils";

const TMP_BUILD_DIRECTORY = path.join(os.tmpdir(), "build");

function getEntrypoints({ entrypoints, buildDirectory }) {
  if (typeof entrypoints === "string") {
    const obj = {};

    glob.sync(entrypoints).forEach((file) => {
      const { dir, name } = path.parse(file);

      // This fixes issues that were causing x.js-[hash].js
      const fileWithoutExt = path.join(dir, name);
      const buildFile = pathToUnix(
        path.relative(buildDirectory, fileWithoutExt)
      );

      obj[buildFile] = file;
    });
    return obj;
  }

  return entrypoints;
}

async function rollupBuild({
  snowpackConfig,
  pluginOptions,
  inputOptions,
  outputOptions,
}) {
  const baseUrl = snowpackConfig.devOptions.baseUrl || "/";
  const TMP_DEBUG_DIRECTORY = path.join(os.tmpdir(), "_source_");

  const buildDirectory = outputOptions.dir;
  outputOptions.dir = TMP_BUILD_DIRECTORY;

  const entrypoints = getEntrypoints({
    entrypoints: pluginOptions.entrypoints,
    buildDirectory,
  });

  inputOptions.input = inputOptions.input || entrypoints;

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.generate(outputOptions);

  const manifest = {};

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.isEntry || chunkOrAsset.type === "asset") {
      addToManifest({ manifest, chunkOrAsset, assignTo: "entrypoints" });
      continue;
    }

    addToManifest({ manifest, chunkOrAsset, assignTo: "chunks" });
  }

  await bundle.write(outputOptions);

  // Add assets to manifest, use path.relative to fix minor issues
  glob.sync(`${TMP_BUILD_DIRECTORY}/**/*.*`).forEach((fileName) => {
    fileName = pathToUnix(path.relative(TMP_BUILD_DIRECTORY, fileName));
    const chunkOrAsset = { fileName, map: null };
    addToManifest({
      manifest,
      chunkOrAsset,
      assignTo: "assets",
      useFileType: false,
    });
  });

  const manifestJSON = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(
    path.join(TMP_BUILD_DIRECTORY, "manifest.json"),
    manifestJSON
  );

  // HTML files will not be pulled in by rollup, its up to us
  // to manually pull them in.
  if (pluginOptions.emitHtmlFiles === true) {
    glob.sync(buildDirectory + "/**/*.html").forEach((file) => {
      let destFile = path.relative(buildDirectory, file);
      destFile = path.resolve(TMP_BUILD_DIRECTORY, destFile);
      const destDir = path.parse(destFile).dir;

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      emitHtmlFiles({ file, manifest, destFile, baseUrl });
    });
  }

  await fs.remove(TMP_DEBUG_DIRECTORY);
  await fs.mkdirp(TMP_DEBUG_DIRECTORY);
  await fs.move(buildDirectory, TMP_DEBUG_DIRECTORY, { overwrite: true });
  await fs.move(TMP_BUILD_DIRECTORY, buildDirectory, { overwrite: true });

  if (pluginOptions.preserveSourceFiles === true) {
    const buildDebugDir = path.join(buildDirectory, "_source_");
    await fs.move(TMP_DEBUG_DIRECTORY + "/", buildDebugDir, {
      overwrite: true,
    });
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
        sourcemap: snowpackConfig.buildOptions.sourcemap,
      });
      const outputOptions = defaultOutputOptions(buildDirectory);

      let extendConfig = (cfg) => cfg;
      if (typeof pluginOptions.extendConfig === "function") {
        extendConfig = pluginOptions.extendConfig;
      } else if (typeof pluginOptions.extendConfig === "object") {
        extendConfig = (cfg) => ({ ...cfg, ...pluginOptions.extendConfig });
      }

      const extendedConfig = await extendConfig({
        snowpackConfig: {
          ...snowpackConfig,
        },
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
      glob
        .sync(buildDirectory + "/**/*.js", { nodir: true })
        .forEach((file) => {
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
