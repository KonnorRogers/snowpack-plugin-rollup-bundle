import path from "path";

import { parseHashFileName } from "./utils";

export function addToManifestData({ manifestData, fileName }) {
  manifestData[parseHashFileName(fileName)] = path.join("/", fileName);
}

export function addToManifestEntrypoint({ manifestData, fileName }) {
  const baseFileName = baseFileName(fileName)
  manifestData.entrypoints = manifestData.entrypoints || {};
  manifestData.entrypoints[baseFileName] =
    manifestData.entrypoints[baseFileName] || {};

  const assignToEntrypoint = (type) => {
    manifestData.entrypoints[baseFileName][type] = path.join("/", fileName);
  }

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

export function addToManifestChunks({ manifestData, fileName }) {
  return
}

// function assign({ to, baseFileName, type }) {
// }

function baseFileName(fileName) {
  return path.parse(parseHashFileName(fileName)).base.split(".")[0];
}
