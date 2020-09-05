const path = require("path");

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/(^[^.]*)\.[^.]*\./, "$1.");
  return path.join(dir, fileWithoutHash);
}
