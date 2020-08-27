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

export function generateManifestFile({ manifestData, buildDirectory }) {
  const manifestJSON = JSON.stringify(manifestData, null, 2);
  if (!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory, { recursive: true });
  }
  fs.writeFileSync(path.resolve(buildDirectory, "manifest.json"), manifestJSON);
}

export function generateManifestData(buildDirectory) {
  const manifest = {};
  const pattern = buildDirectory + "/**/*";

  glob
    .sync(pattern)
    .filter((file) => {
      return fs.statSync(file).isFile() && path.parse(file).ext !== ".html";
    })
    .map((oldPath) => {
      oldPath = path.resolve(oldPath);
      const hashValue = createHashFromFile(oldPath);

      const relativePath = path.relative(buildDirectory, oldPath);
      let newPath = path.resolve(
        buildDirectory,
        createHashFileName(relativePath, hashValue)
      );
      fs.renameSync(oldPath, newPath);

      oldPath = path.relative(buildDirectory, oldPath);
      newPath = path.relative(buildDirectory, newPath);

      manifest[oldPath] = newPath;
    });

  return manifest;
}

function createHashFileName(filePath, hashValue) {
  const { dir, base } = path.parse(filePath);

  return path.join(
    dir,
    base.replace(/\.(.*)/, (match) => {
      return "." + hashValue + match;
    })
  );
}

function createHashFromFile(filePath) {
  const hash = crypto.createHash("sha1");
  const data = fs.readFileSync(filePath);
  hash.update(data);
  return hash.digest("hex");
}
