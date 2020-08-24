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
  const buildDirName = path.parse(buildDirectory).name;

  glob
    .sync(pattern)
    .filter((file) => {
      return fs.statSync(file).isFile() && path.parse(file).ext !== ".html";
    })
    .map((oldPath) => {
      oldPath = path.resolve(buildDirectory, oldPath);
      const hashValue = createHashFromFile(oldPath);

      const relativePath = path.relative(buildDirectory, oldPath);
      const newPath = path.resolve(
        buildDirectory,
        createHashFileName(relativePath, hashValue)
      );
      fs.renameSync(oldPath, newPath);

      const paths = [oldPath, newPath].map((filePath) => {
        return path.join(buildDirName, path.relative(buildDirectory, filePath));
      });

      console.log(paths);
      const [oldFilePath, hashedFilePath] = paths;
      manifest[oldFilePath] = hashedFilePath;
    });

  return manifest;
}

function createHashFileName(filePath, hashValue) {
  const parsedPath = path.parse(filePath);

  return (
    path.join(parsedPath.dir, parsedPath.name) +
    "." +
    hashValue +
    parsedPath.ext
  );
}

function createHashFromFile(filePath) {
  const hash = crypto.createHash("sha1");
  const data = fs.readFileSync(filePath);
  hash.update(data);
  return hash.digest("hex");
}
