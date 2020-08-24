const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Checks that crypto is possible
let crypto;
try {
  crypto = require("crypto");
} catch (err) {
  throw "crypto support is disabled!";
}

export function generateManifest(buildDirectory) {
  const manifest = {};
  const pattern = buildDirectory + "**/**";

  glob
    .sync(pattern)
    .filter((file) => {
      return fs.statSync(file).isFile() && path.parse(file).ext !== ".html";
    })
    .map((oldPath) => {
      oldPath = path.resolve(buildDirectory, oldPath);
      const hashValue = createHashFromFile(oldPath);

      const relativePath = path.relative(buildDirectory, oldPath);
      const newPath = createHashFileName(relativePath, hashValue);
      fs.renameSync(oldPath, newPath);
      manifest[oldPath] = newPath;
    });

  return manifest;
}

function createHashFileName(filePath, hashValue) {
  const parsedPath = path.parse(filePath);

  return parsedPath.dir + parsedPath.name + "." + hashValue + parsedPath.ext;
}

function createHashFromFile(filePath) {
  const hash = crypto.createHash("sha256");
  const data = fs.readFileSync(filePath);
  hash.update(data);
  return hash.digest("hex");
}
