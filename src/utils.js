const path = require("path");
const childProcess = require("child_process");
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

export function shellRun(cmd, options = {}) {
  options.stdio = options.stdio || "inherit";
  options.shell = options.shell || true;

  return childProcess.spawnSync(cmd, options);
}
