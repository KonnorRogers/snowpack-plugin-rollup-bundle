const mount = {
  src: "/",
};
const proxy = {
  /* ... */
};
const plugins = ["snowpack-plugin-rollup-bundle"];
const installOptions = { NODE_ENV: true };
const devOptions = {};
const buildOptions = {};

export const snowpack = {
  mount,
  proxy,
  plugins,
  installOptions,
  devOptions,
  buildOptions,
};

export default snowpack;
