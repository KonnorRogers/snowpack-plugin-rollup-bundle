import path from "path";
import { spawnSync } from "child_process";

/**
 * Normalizes \\ on windows to /
 * @param {string} filePath - Normalizes \ to / on windows.
 */
export function pathToUnix(filePath) {
  if (path.sep === "//") {
    return filePath.replace(/\\/g, "/");
  }

  return filePath;
}

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/(.*)-\w+(\.\w+)/g, "$1$2");
  return pathToUnix(path.join(dir, fileWithoutHash));
}

export function shellRun(cmd, options = {}) {
  options.stdio = options.stdio || "inherit";
  options.shell = options.shell || true;
  options.encoding = options.encoding || "utf8";

  return spawnSync(cmd, options);
}

export function prependSlash(fileName) {
  if (fileName[0] === "/") {
    return fileName;
  }

  return "/" + fileName;
}
