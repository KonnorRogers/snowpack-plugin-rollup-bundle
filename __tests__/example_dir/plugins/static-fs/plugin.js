const fs = require("fs")
module.exports = function staticFsPlugin(snowpackConfig, pluginOptions) {
  return {
    name: "snowpack-plugin-static-fs",
    async transform({fileExt, contents}) {
      if (fileExt !== ".js") return
      return contents.replace(/staticFs(.*)\.\((.*)\)/, (_fullMatch, fn, contents) => {
        return fs[fn](contents)
      })
    }
  }
}
