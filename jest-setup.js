import { shellRun } from "./src/utils";

export default async function globalSetup() {
  const build = await buildPkg();
  return build
}

async function buildPkg() {
  const build = shellRun("yarn build");
  if (build.status !== 0) {
    throw "Unable to build your package";
  }
  return build
}


