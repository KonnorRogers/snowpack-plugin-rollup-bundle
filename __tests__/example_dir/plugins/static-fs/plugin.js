const fs = require("fs")

module.exports = function staticFsPlugin(snowpackConfig, pluginOptions) {
  return {
    name: "snowpack-plugin-static-fs",
    async transform({fileExt, contents}) {
      if (fileExt !== ".js") return;

      return contents.replace(/staticFs.readdirSync\((.*)\)/, (fullMatch, captureGroup) => {
        console.log(fullMatch)
        console.log(captureGroup)
        return fs.readdirSync(captureGroup)
      })
    }
  }
}
