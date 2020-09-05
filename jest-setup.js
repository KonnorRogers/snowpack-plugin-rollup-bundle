import { shellRun } from "./src/utils"

export default async function globalSetup() {
  const { status } = await build()
  if (status !== 0) throw "Unable to build your package"
}

async function build() {
  return shellRun("yarn build")
}
