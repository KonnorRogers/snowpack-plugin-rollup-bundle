import { parseHashFileName } from "./utils";
import path from "path";

export function addToManifest({
  manifest,
  chunkOrAsset,
  assignTo,
  useFileType = true,
}) {
  const { fileName } = chunkOrAsset;
  const asset = chunkOrAsset;
  const assignment = assignTo;

  manifest[parseHashFileName(fileName)] = prependSlash(fileName);

  manifest[assignment] = manifest[assignment] || {};

  assignAsset({
    obj: manifest[assignment],
    asset,
    useFileType,
  });
}

export function prependSlash(fileName) {
  if (fileName[0] === "/") {
    return fileName;
  }

  return "/" + fileName;
}

function assignAsset({ obj, asset, useFileType }) {
  const { map, fileName } = asset;

  let fileType = extType(fileName);

  let baseName;

  // Non js / js.map / css / css.map files retain their extension
  if (fileType === null) {
    baseName = parseHashFileName(fileName);
  } else {
    baseName = path.parse(parseHashFileName(fileName)).name.split(".")[0];
  }

  const adjustedFileName = prependSlash(fileName);

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

  return null;
}
