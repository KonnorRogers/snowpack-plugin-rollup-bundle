const fs = require("fs");
const path = require("path");

const mount = {
  // public: "/",
  // src: "/_dist_",
  src: "/"
};

const proxy = {
  /* ... */
};
const plugins = [
  [
    "snowpack-plugin-rollup-bundle",
    {
      extendConfig: (config) => {
        config.outputOptions.dir = "build/packs"
        config.inputOptions.input = [
          "build/packs/application.js",
          "build/packs/pack2.js"
        ]
        return config;
      },
    },
  ],
];
const installOptions = {
  NODE_ENV: true,
  rollup: {
    plugins: [require("rollup-plugin-node-polyfills")()],
  },
};

const alias = {
  "@channels": "./src/channels",
  "@js": "./src/javascript",
  "@css": "./src/stylesheets",
  "@assets": "./src/assets",
};

const devOptions = {
  out: "build",
  open: "none",
  bundle: true
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
