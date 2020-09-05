const path = require("path");
// const fs = require("fs")

// // Checks that crypto is possible
// let crypto;
// try {
//   crypto = require("crypto");
// } catch (err) {
//   throw "crypto support is disabled!";
// }

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/(^[^.]*)\.[^.]*\./, "$1.");
  return path.join(dir, fileWithoutHash);
}

//function findFilePathInManifest(manifestFile) {
//  //
//}
