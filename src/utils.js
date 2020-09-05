const path = require("path");
const childProcess = require("child_process");

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/(^[^.]*)\.[^.]*\./, "$1.");
  return path.join(dir, fileWithoutHash);
}

export function shellRun(cmd, options = {}) {
  options.stdio = options.stdio || "inherit";
  options.shell = options.shell || true;

  return childProcess.spawnSync(cmd, options);
}

export function addToManifestData({manifestData, fileName, buildDirectory}) {
  manifestData[parseHashFileName(fileName)] = path.join(
    "/",
    buildDirectory,
    fileName
  );
}
