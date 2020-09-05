// const glob = require("glob")
// const fs = require("fs")
const path = require("path");
const { exec } = require('child_process');

export function parseHashFileName(filePath) {
  const { dir, base } = path.parse(filePath);

  const fileWithoutHash = base.replace(/\..*\./, ".");
  return path.join(dir, fileWithoutHash);
}

// export function findFileInManifest(manifestData, fileName) {

// }

// export function emitHtmlFiles(source, destination) {
//   const htmlFiles = source + "**/*.html"
//   glob.sync(htmlFiles).forEach((file) => {

//   })

// }

export async function shellRun(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

