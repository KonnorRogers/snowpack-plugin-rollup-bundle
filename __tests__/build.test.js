const process = require("process")
const childProcess = require("child_process")
const path = require("path")
const fs = require("fs")

const consoleSpy = jest.spyOn(console, "log").mockImplementation()

test('Should produce a manifest.json', () => {
  const buildDir = path.join(process.env.EXAMPLE_DIR, "build")
  childProcess.execSync(`rm -rf ${buildDir}`)
  const manifestFile = path.join(buildDir, "manifest.json")

  // build without error
  process.chdir(process.env.EXAMPLE_DIR)
  childProcess.execSync("yarn build")

  fs.existsSync(manifestFile)
});
