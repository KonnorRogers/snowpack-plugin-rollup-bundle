const childProcess = require("child_process")

export default async function globalSetup() {
  childProcess.execSync("yarn build")
}
