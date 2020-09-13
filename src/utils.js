import path from "path";
import { spawnSync } from "child_process";

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/(.*)-\w+(\.\w+)/g, "$1$2");
  return path.join(dir, fileWithoutHash);
}

export function shellRun(cmd, options = {}) {
  options.stdio = options.stdio || "inherit";
  options.shell = options.shell || true;
  options.encoding = options.encoding || "utf8";

  return spawnSync(cmd, options);
}

export function addToManifestData({ manifestData, fileName }) {
  manifestData[parseHashFileName(fileName)] = path.join("/", fileName);
}

export function addToManifestEntrypoint({ manifestData, fileName }) {
  const baseFileName = path
    .parse(parseHashFileName(fileName))
    .base.split(".")[0];
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
