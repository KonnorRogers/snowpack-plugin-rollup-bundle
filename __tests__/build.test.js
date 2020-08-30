const process = require("process");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

const buildDir = path.join(process.env.EXAMPLE_DIR, "build");

beforeAll(() => {
  childProcess.execSync(`rm -rf ${buildDir}`);
  process.chdir(process.env.EXAMPLE_DIR);
  childProcess.execSync("yarn build");
});

test("Should produce a manifest.json", () => {
  const manifestFile = path.join(buildDir, "manifest.json");
  expect(fs.existsSync(manifestFile)).toBe(true);
});
