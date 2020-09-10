const fs = require("fs")

module.exports = function staticFsPlugin(snowpackConfig, pluginOptions) {
  return {
    name: "snowpack-plugin-static-fs",
    async transform({fileExt, contents}) {
      if (fileExt !== ".js") return;

      const regex = /snowpackEval\(([\S\s]*)\)/gm
      const valueToReplace = contents.match(regex)
    }
  }
}
