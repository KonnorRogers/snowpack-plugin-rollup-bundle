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

export function addToManifestData({ manifestData, fileName }) {
  manifestData[parseHashFileName(fileName)] = path.join("/", fileName);
}

export function addToManifestEntrypoint({ manifestData, fileName }) {
  const baseFileName = path.parse(fileName).base.split(".")[0];
  manifestData.entrypoints = manifestData.entrypoints || {};
  manifestData.entrypoints[baseFileName] =
    manifestData.entrypoints[baseFileName] || {};

  const assignToEntrypoint = (type) => {
    manifestData.entrypoints[baseFileName][type] = path.join("/", fileName);
  };

  if (fileName.endsWith(".css.map")) {
    assignToEntrypoint("css.map");
  } else if (fileName.endsWith(".css")) {
    assignToEntrypoint("css");
  } else if (fileName.endsWith(".js.map")) {
    assignToEntrypoint("js.map");
  } else if (fileName.endsWith(".js")) {
    assignToEntrypoint("js");
  }
}

// export function findInManifestObject({manifest, }) {
//   manifestObject
// }
