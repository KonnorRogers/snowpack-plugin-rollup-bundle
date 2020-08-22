// import { nodeResolve } from  "@rollup/plugin-node-resolve"
const mount = {
  "src": "/"
}

const proxy = { /* ... */ }
const plugins = [] // "snowpack-plugin-rollup-bundle" ]
const installOptions = {
  NODE_ENV: true,
  // rollup: {
  //   plugins: [require('rollup-plugin-node-polyfills')()],
  // },
}

// const alias = {
//   "@channels": "./src/channels",
//   "@js": "./src/javascript",
//   "@css": "./src/stylesheets",
//   "@assets": "./src/assets"
// }
const devOptions = {
  out: "dist",
}
const buildOptions = {
  clean: true
}

module.exports = {
  mount,
  // alias,
  proxy,
  plugins: plugins,
  installOptions,
  devOptions,
  buildOptions
}
