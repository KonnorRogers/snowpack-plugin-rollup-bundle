const path = require("path")
const process = require("process")

import { shellRun } from "./src/utils"

export default async function globalSetup() {
  const { status } = await build()
  if (status !== 0) throw "Unable to build your package"
}

async function build() {
  shellRun("yarn build")

  const exampleDir = path.resolve("__tests__", "example_dir");
  const buildDir = path.join(exampleDir, "build");

  // Remove and Rebuild the build directory
  shellRun(`rm -rf ${buildDir}`);

  process.chdir(exampleDir);

  const { status } = shellRun("yarn install --force && yarn build");

  if (status !== 0) throw "An error occurred building the test directory";
}
