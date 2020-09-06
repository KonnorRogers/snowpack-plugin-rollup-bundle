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
  const baseFileName = fileName.split(".")[0];
  const assignToEntrypoint = (type) => {
    Object.assign(manifestData.entrypoints[baseFileName], {
      [type]: path.join("/", fileName),
    });
  };
  switch (fileName) {
    case fileName.endsWith(".css.map"):
      assignToEntrypoint("css.map");
      break;
    case fileName.endsWith(".css"):
      assignToEntrypoint("css");
      break;
    case fileName.endsWith(".js.map"):
      assignToEntrypoint("js.map");
      break;
    case fileName.endsWith(".js"):
      assignToEntrypoint("js");
      break;
  }
}

// export function findInManifestObject({manifest, }) {
//   manifestObject
// }
