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
        // const entryFileDir = path.resolve("dist", "packs")
        // config.outputOptions.dir = config.bui
        const buildDir = config.outputOptions.dir;

        const files = []
        const dirs = ["packs", "channels", "stylesheets", "javascript"];
        dirs.forEach(dir => {
          fs.readdirSync(dir).forEach(file => {
            files.push(path.relative(process.cwd(), path.resolve(buildDir, dir, file)))
          })
        })
        // const dirGlobs = dirs.map((dir) => `${buildDir}/${dir}/**/*.js`);
        config.inputOptions.input = path.resolve(buildDir, dir)

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
