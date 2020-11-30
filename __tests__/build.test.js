import { assert } from "chai";
import path from "path";
import process from "process";
import fs from "fs";

// DOM Assertions
import { JSDOM } from "jsdom";

import { parseHashFileName, shellRun } from "../src/utils";

const exampleDir = path.resolve("__tests__", "examples", "example_dir");
const buildDir = path.resolve(exampleDir, "build");
process.chdir(exampleDir);
shellRun("yarn install --force");
shellRun("yarn snowpack build --verbose");

describe("Build", () => {
  before(function () {
    process.chdir(exampleDir);
  });

  it("Should produce entrypoints and manifest.json", () => {
    const buildFiles = ["entrypoints", "manifest.json"].map((file) =>
      path.resolve(buildDir, file)
    );

    buildFiles.forEach((file) => {
      assert.isTrue(fs.existsSync(file));
    });
  });

  it("Should produce css files, including module.css files", () => {
    const entryFiles = fs.readdirSync(path.resolve(buildDir, "entrypoints"));
    const cssFiles = fs.readdirSync(
      path.resolve(buildDir, "css", "entrypoints")
    );
    assert.equal(cssFiles.length, entryFiles.length);

    const entryFileNames = entryFiles.map(
      (file) => parseHashFileName(file).split(".")[0]
    );
    const cssFileNames = cssFiles.map(
      (file) => parseHashFileName(file).split(".")[0]
    );
    cssFileNames.forEach((name) => {
      assert.isTrue(entryFileNames.includes(name));
    });
  });

  it("Should create an assets directory for all non-css and non-js files", () => {
    const files = fs.readdirSync(path.resolve(buildDir, "assets"));
    assert.notEqual(files.length, 0);
  });

  it("Should appropriately format a manifest.json", () => {
    const manifestData = JSON.parse(
      fs.readFileSync(path.join(buildDir, "manifest.json"), {
        encoding: "utf8",
      })
    );

    const entrypointFiles = fs.readdirSync(path.join(buildDir, "entrypoints"));

    const manifestEntrypoints = Object.keys(manifestData.entrypoints);

    // Divide by 2 to exclude map files
    // { application, pack-2 }
    assert.equal(manifestEntrypoints.length, entrypointFiles.length / 2);

    // { js, js.map, css, css.map }
    const manifestEntrypointKeys = Object.keys(
      manifestData.entrypoints[manifestEntrypoints[0]]
    );
    assert.equal(manifestEntrypointKeys.length, 4);
  });

  describe("JSDOM based assertions", () => {
    it("Should rewrite to a hashed script for index.html", () => {
      const jsdom = new JSDOM(
        fs.readFileSync(path.join(buildDir, "index.html"))
      );
      const jsdocument = jsdom.window.document;
      const scripts = jsdocument.querySelectorAll("script");
      const manifest = JSON.parse(
        fs.readFileSync(path.join(buildDir, "manifest.json"))
      );

      scripts.forEach((script) => {
        const baseName = path
          .parse(parseHashFileName(script.src))
          .name.split(".")[0];

        assert.equal(manifest.entrypoints[baseName]["js"], script.src);
      });

      const HTMLFiles = ["index.html", "html/index.html"];

      HTMLFiles.forEach((file) => {
        file = path.resolve(buildDir, file);

        assert.isTrue(fs.existsSync(file));
      });
    });
  });
});
