const path = require("path");
const process = require("process");

import { shellRun } from "./src/utils";

export default async function globalSetup() {
  const buildPkg = await build();
  if (buildPkg.status !== 0) {
    throw "Unable to build your package";
  }

  const buildTestDir = await buildTestDirectory();
  if (buildTestDir.status !== 0) {
    throw "An error occurred building the test directory";
  }
}

async function build() {
  return shellRun("yarn build");
}

async function buildTestDirectory() {
  const exampleDir = path.resolve("__tests__", "example_dir");
  const buildDir = path.join(exampleDir, "build");

  // Remove and Rebuild the build directory
  shellRun(`rm -rf ${buildDir}`);

  return shellRun(`cd ${exampleDir} && yarn install --force && yarn build`);
}
