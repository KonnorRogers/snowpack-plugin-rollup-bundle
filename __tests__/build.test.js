import { describe, it, expect, beforeAll } from "@jest/globals"
import path from "path";
import process from "process";
import fs from "fs";

// DOM Assertions
import { JSDOM } from "jsdom";

import { parseHashFileName, shellRun } from "../src/utils";

const exampleDir = path.resolve("__tests__", "examples", "example_dir");
const buildDir = path.resolve(exampleDir, "build");

describe("Build", () => {
  beforeAll(() => {
    shellRun("yarn install --force");
    shellRun("yarn snowpack build --verbose");
    process.chdir(exampleDir);
  });

  it("Should produce entrypoints and manifest.json", () => {
    const buildFiles = ["entrypoints", "manifest.json"].map((file) =>
      path.resolve(buildDir, file)
    );

    buildFiles.forEach((file) => {
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  it("Should produce css files, including module.css files", () => {
    const entryFiles = fs.readdirSync(path.resolve(buildDir, "entrypoints"));
    const cssFiles = fs.readdirSync(
      path.resolve(buildDir, "css", "entrypoints")
    );
    expect(cssFiles.length).toEqual(entryFiles.length);

    const entryFileNames = entryFiles.map(
      (file) => parseHashFileName(file).split(".")[0]
    );
    const cssFileNames = cssFiles.map(
      (file) => parseHashFileName(file).split(".")[0]
    );
    cssFileNames.forEach((name) => {
      expect(entryFileNames.includes(name)).toBe(true);
    });
  });

  it("Should create an assets directory for all non-css and non-js files", () => {
    const files = fs.readdirSync(path.resolve(buildDir, "assets"));
    expect(files.length).not.toEqual(0);
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
    expect(manifestEntrypoints.length).toEqual(entrypointFiles.length / 2);

    // { js, js.map, css, css.map }
    const manifestEntrypointKeys = Object.keys(
      manifestData.entrypoints[manifestEntrypoints[0]]
    );
    expect(manifestEntrypointKeys.length).toEqual(4);
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

        expect(manifest.entrypoints[baseName]["js"]).toEqual(script.src);
      });

      const HTMLFiles = ["index.html", "html/index.html"];

      HTMLFiles.forEach((file) => {
        file = path.resolve(buildDir, file);

        expect(fs.existsSync(file)).toEqual(true);
      });
    });
  });
});
