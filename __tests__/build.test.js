const path = require("path")
const process = require("process")
const childProcess = require("child_process")

const EXAMPLE_DIR = path.resolve("__tests__", "example_dir")

beforeAll(() => {
  process.chdir(EXAMPLE_DIR)
  childProcess.execSync("yarn install && yarn build")
})

