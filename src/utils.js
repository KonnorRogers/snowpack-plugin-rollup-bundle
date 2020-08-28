const path = require("path");

export function fileWithoutHash(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/\..*\./, ".");
  return path.join(dir, fileWithoutHash);
}

// export function findFileInManifest(manifest, file) {

// }
