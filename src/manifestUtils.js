import { prependSlash, parseHashFileName } from "./utils";
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

function assignAsset({ obj, asset, useFileType }) {
  const { map, fileName } = asset;

  let fileType = extType(fileName);

  let baseName;

  // Non js / js.map / css / css.map files retain their extension
  if (fileType === null) {
    baseName = parseHashFileName(fileName);
  } else {
    // Split at the first . just in case it has multiple extensions IE: .css.map
    let { name } = path.parse(parseHashFileName(fileName));

    baseName = name = name.split(".")[0];
    // baseName = path.posix.join(dir, name);
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
