const process = require("process");
const path = require("path");
const fs = require("fs");

import { shellRun } from "../src/utils";

const exampleDir = path.resolve("__tests__", "example_dir");
const buildDir = path.join(exampleDir, "build");

// Remove and Rebuild the build directory
// shellRun(`rm -rf ${buildDir}`);

process.chdir(exampleDir);

const { status } = shellRun("yarn install --force && yarn build");

if (status !== 0) throw "An error occurred building the test directory";

describe("generates proper files", () => {
  test("Should produce entrypoints and manifest.json", () => {
    const buildFiles = ["entrypoints", "manifest.json"].map((file) =>
      path.join(buildDir, file)
    );

    buildFiles.forEach((file) => {
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  test("Should produce css files, including module.css files", () => {
    const entryFiles = fs.readdirSync(path.join(buildDir, "entrypoints"));
    const cssFiles = fs.readdirSync(path.join(buildDir, "css"));
    expect(cssFiles).toHaveLength(entryFiles.length);

    const entryFileNames = entryFiles.map((file) => file.split(".")[0]);
    const cssFileNames = cssFiles.map((file) => file.split(".")[0]);

    cssFileNames.forEach((name) => {
      expect(entryFileNames).toContain(name);
    });
  });

  test("Should create an assets directory for all non-css and non-js files", () => {
    const files = fs.readdirSync(path.join(buildDir, "assets"));
    expect(files).not.toHaveLength(0);
  });
});
