import { suite } from "uvu";
import * as assert from "uvu/assert";

import path from "path";
import process from "process";
import fs from "fs";

import { parseHashFileName, shellRun } from "../src/utils";

const exampleDir = path.resolve("__tests__", "example_dir");
const buildDir = path.resolve(exampleDir, "build");

const Build = suite("Build");

process.chdir(exampleDir);
shellRun("yarn install --force");
shellRun("yarn snowpack build");

Build("Should produce entrypoints and manifest.json", () => {
  const buildFiles = ["entrypoints", "manifest.json"].map((file) =>
    path.resolve(buildDir, file)
  );

  buildFiles.forEach((file) => {
    assert.is(fs.existsSync(file), true);
  });
});

Build("Should produce css files, including module.css files", () => {
  const entryFiles = fs.readdirSync(path.resolve(buildDir, "entrypoints"));
  const cssFiles = fs.readdirSync(path.resolve(buildDir, "css"));
  assert.is(cssFiles.length, entryFiles.length);

  const entryFileNames = entryFiles.map(
    (file) => parseHashFileName(file).split(".")[0]
  );
  const cssFileNames = cssFiles.map(
    (file) => parseHashFileName(file).split(".")[0]
  );
  cssFileNames.forEach((name) => {
    assert.ok(entryFileNames.includes(name));
  });
});

Build(
  "Should create an assets directory for all non-css and non-js files",
  () => {
    const files = fs.readdirSync(path.resolve(buildDir, "assets"));
    assert.is.not(files.length, 0);
  }
);

Build("Should appropriately format a manifest.json", () => {
  const manifestData = JSON.parse(
    fs.readFileSync(path.join(buildDir, "manifest.json"), { encoding: "utf8" })
  );

  const entrypointFiles = fs.readdirSync(path.join(buildDir, "entrypoints"));

  assert.is(manifestData.entrypoints.length, entrypointFiles.length);
});

Build.run();
