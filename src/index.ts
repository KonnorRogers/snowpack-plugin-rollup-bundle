
import { InputOption, OutputOptions } from 'rollup';
import type { SnowpackPluginFactory } from "snowpack";

import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
// https://www.npmjs.com/package/@rollup/plugin-dynamic-import-vars

import outputManifest from 'rollup-plugin-output-manifest';
// https://github.com/shuizhongyueming/rollup-plugin-output-manifest/tree/master/packages/main

const rollup = import("rollup")

const inputOptions: InputOption = {
  external,
  input, // conditionally required
  plugins: [
    dynamicImportVars()
  ]

  // advanced input options
  cache,
  onwarn,
  preserveEntrySignatures,
  strictDeprecations,

  // danger zone
  acorn,
  acornInjectPlugins,
  context,
  moduleContext,
  preserveSymlinks,
  shimMissingExports,
  treeshake,

  // experimental
  experimentalCacheExpiry,
  perf
}

const outputOptions: OutputOptions = {
    // core output options
  dir: buildDirectory,
  format: "es" // required, esmodules
  plugins: [],

  // advanced output options
  assetFileNames,
  banner,
  chunkFileNames,
  compact,
  entryFileNames,
  extend,
  externalLiveBindings,
  footer,
  hoistTransitiveImports,
  inlineDynamicImports,
  interop,
  intro,
  manualChunks,
  minifyInternalExports,
  outro,
  paths,
  preserveModules,
  sourcemap,
  sourcemapExcludeSources,
  sourcemapFile,
  sourcemapPathTransform,

  // danger zone
  amd,
  esModule,
  exports,
  freeze,
  indent,
  namespaceToStringTag,
  noConflict,
  preferConst,
  strict,
  systemNullSetters
}

async function rollupBuild({inputOptions, outputOptions}) {
  const bundle = await rollup.rollup(inputOptions)
  const { output } = await bundle.generate(outputOptions)

  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      // assets
      // fileName: string,              // the asset file name
      // source: string | Uint8Array    // the asset source
      // type: 'asset'                  // signifies that this is an asset
      //
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
