import path from "path";

import { parseHashFileName } from "./utils";

export function addToManifest({
  manifest,
  chunkOrAsset,
  assignTo,
  useFileType = true,
}) {
  const { fileName } = chunkOrAsset;
  const asset = chunkOrAsset;
  const assignment = assignTo;

  manifest[parseHashFileName(fileName)] = path.join("/", fileName);

  manifest[assignment] = manifest[assignment] || {};

  assignAsset({
    obj: manifest[assignment],
    asset,
    useFileType,
  });
}

function assignAsset({ obj, asset, useFileType }) {
  const { map, fileName } = asset;

  let fileType = extType(fileName);
  const baseName = baseFileName(fileName);
  const adjustedFileName = path.join("/", fileName);

  obj[baseName] = obj[baseName] || {};

  if (useFileType === false) {
    obj[baseName] = adjustedFileName;
    return;
  }

  obj[baseName][fileType] = adjustedFileName;

  if (map) {
    const mapFile = adjustedFileName + ".map";
    fileType = extType(mapFile);
    obj[baseName][fileType] = mapFile;
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

  return "";
}

function baseFileName(fileName) {
  return path.parse(parseHashFileName(fileName)).base.split(".")[0];
}
