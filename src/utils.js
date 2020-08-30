const path = require("path");

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/\..*\./, ".");
  return path.join(dir, fileWithoutHash);
}
