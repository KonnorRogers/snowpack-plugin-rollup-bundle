const path = require("path");

import { shellRun } from "./src/utils";

export default async function globalSetup() {
  const build = await buildPkg();
  if (build.status !== 0) {
    throw "Unable to build your package";
  }
}

async function buildPkg() {
  return shellRun("yarn build");
}
