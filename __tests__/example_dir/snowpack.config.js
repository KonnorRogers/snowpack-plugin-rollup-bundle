const glob = require("glob");
const path = require("path");

const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs')
const nodePolyfills = require("rollup-plugin-node-polyfills")

const mount = {
  src: "/",
};

const proxy = {
  /* ... */
};

const plugins = [
  // ["@snowpack/plugin-babel"],
  // ["snowpack-plugin-static-fs"],
  [
    "snowpack-plugin-rollup-bundle",
    {
      extendConfig: (config) => {
        config.outputOptions.dir = "build";
        config.inputOptions.input = glob.sync(path.join("build", "entrypoints", "**", "*"));
        return config;
      },
    },
  ],
];

const installOptions = {
  NODE_ENV: true,
  rollup: {
    plugins: [
      nodePolyfills({fs: true}),
      commonjs(),
      resolve({
        preferBuiltins: false
      }),
    ]
  }
};

const alias = {
  /* */
};

const devOptions = {
  out: "build",
  open: "none",
  bundle: true,
};

const buildOptions = {
  clean: true,
};

module.exports = {
  mount,
  alias,
  proxy,
  plugins: plugins,
  installOptions,
  devOptions,
  buildOptions,
};
