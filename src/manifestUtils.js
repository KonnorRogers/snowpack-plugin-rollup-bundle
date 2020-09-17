import path from "path";

import { parseHashFileName } from "./utils";

export function addToManifestData({ manifestData, chunkOrAsset }) {
  if (chunkOrAsset == undefined) {
    return;
  }

  const { fileName, isEntry, type } = chunkOrAsset;
  manifestData[parseHashFileName(fileName)] = path.join("/", fileName);

  // Add entryfiles for CSS files and entrypoint js files
  if (isEntry || type === "asset") {
    addToManifestEntrypoints({ manifestData, chunkOrAsset });
    return;
  }

  // It must now be a chunk and non-entrypoint
  addToManifestChunks({ manifestData, chunkOrAsset });
}

export function addToManifestEntrypoints({ manifestData, chunkOrAsset }) {
  manifestData.entrypoints = manifestData.entrypoints || {};

  assignTypeToFile({
    obj: manifestData.entrypoints,
    chunkOrAsset,
  });
}

export function addToManifestChunks({ manifestData, chunkOrAsset }) {
  manifestData.chunks = manifestData.chunks || {};
  assignTypeToFile({
    obj: manifestData.chunks,
    chunkOrAsset,
  });
}

export function findInManifest({ manifestData, assetType, fileName }) {
  const baseName = baseFileName(fileName);
  manifestData[assetType][baseName];
}

function assignTypeToFile({ obj, chunkOrAsset }) {
  if (chunkOrAsset == undefined) {
    return;
  }

  const { map, fileName } = chunkOrAsset;

  let fileType = extType(fileName);
  const baseName = baseFileName(fileName);

  obj[baseName] = obj[baseName] || {};

  obj[baseName][fileType] = path.join("/", fileName);

  if (map) {
    const mapFile = fileName + ".map";
    fileType = extType(mapFile);
    obj[baseName][fileType] = path.join("/", mapFile);
  }
}

function extType(fileName) {
  if (fileName.endsWith(".css.map")) {
    return "css.map";
  } else if (fileName.endsWith(".css")) {
    return "css";
  } else if (fileName.endsWith(".js.map")) {
    return "js.map";
  } else if (fileName.endsWith(".js")) {
    return "js";
  }
}

function baseFileName(fileName) {
  return path.parse(parseHashFileName(fileName)).base.split(".")[0];
}
