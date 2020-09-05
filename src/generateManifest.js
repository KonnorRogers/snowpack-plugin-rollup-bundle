// const fs = require("fs");
// const path = require("path");
// const glob = require("glob");

// export function appendToManifestFile({ manifestData, buildDirectory }) {
//   const manifestJSON = JSON.stringify(manifestData, null, 2);

//   if (!fs.existsSync(buildDirectory)) {
//     fs.mkdirSync(buildDirectory, { recursive: true });
//   }
//   fs.appendFileSync(path.resolve(buildDirectory, "manifest.json"), manifestJSON);
// }

// export function generateManifestData({buildDirectory, ...directories}) {
//   const manifest = {};
//   const nonEntrypoints = directories.join("|")
//   const pattern = buildDirectory + nonEntrypoints + "/**/*";

//   glob
//     .sync(pattern, {
//       nodir: true,
//     })
//     .filter((file) => {
//       return path.parse(file).ext !== ".html";
//     })
//     .map((oldPath) => {
//       oldPath = path.resolve(oldPath);
//       const hashValue = createHashFromFile(oldPath);

//       const relativePath = path.relative(buildDirectory, oldPath);
//       let newPath = path.resolve(
//         buildDirectory,
//         createHashFileName(relativePath, hashValue)
//       );

//       oldPath = path.relative(buildDirectory, oldPath);
//       newPath = path.relative(buildDirectory, newPath);

//       manifest[oldPath] = newPath;
//     });

//   return manifest;
// }
