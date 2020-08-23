const fs = require("fs");
const path = require("path");

const mount = {
  src: "/",
};

const proxy = {
  /* ... */
};
const plugins = [
  [
    "snowpack-plugin-rollup-bundle",
    {
      extendConfig: (config) => {
        const entryFileDir = path.resolve("dist", "packs");
        config.outputOptions.dir = entryFileDir
        config.inputOptions.input = fs
          .readdirSync(entryFileDir)
          .map((file) => path.join(entryFileDir, file));

        return config
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
  out: "dist",
  open: "none",
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
