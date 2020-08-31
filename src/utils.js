const glob = require("glob")
const fs = require("fs")
const path = require("path");

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/\..*\./, ".");
  return path.join(dir, fileWithoutHash);
}

export function emitHtmlFiles(source, destination) {
  const htmlFiles = source + "**/*.html"
  glob.sync(htmlFiles).forEach((file) => {

  })

}
