const path = require("path");
const process = require("process");
const fs = require("fs");

import { shellRun } from "../src/utils";

const exampleDir = path.resolve("__tests__", "example_dir");
const buildDir = path.resolve(exampleDir, "build");

process.chdir(exampleDir);
shellRun("yarn install --force");
shellRun("yarn snowpack build");

// describe("generates proper files", () => {
test("Should produce entrypoints and manifest.json", () => {
  const buildFiles = ["entrypoints", "manifest.json"].map((file) =>
    path.resolve(buildDir, file)
  );

  buildFiles.forEach((file) => {
    expect(fs.existsSync(file)).toBe(true);
  });
});

//   test("Should produce css files, including module.css files", () => {
//     const entryFiles = fs.readdirSync(path.resolve(buildDir, "entrypoints"));
//     const cssFiles = fs.readdirSync(path.resolve(buildDir, "css"));
//     expect(cssFiles).toHaveLength(entryFiles.length);

//     const entryFileNames = entryFiles.map((file) => file.split(".")[0]);
//     const cssFileNames = cssFiles.map((file) => file.split(".")[0]);

//     cssFileNames.forEach((name) => {
//       expect(entryFileNames).toContain(name);
//     });
//   });

//   test("Should create an assets directory for all non-css and non-js files", () => {
//     const files = fs.readdirSync(path.resolve(buildDir, "assets"));
//     expect(files).not.toHaveLength(0);
//   });
// });
