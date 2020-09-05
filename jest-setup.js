const childProcess = require("child_process");

export default async function globalSetup() {
  const { status } = await build()
  if (status !== 0) throw "Unable to build your package"
}

async function build() {
  const obj = childProcess.spawnSync("yarn build", {
    stdio: 'inherit',
    shell: true
  })

  return obj
}
