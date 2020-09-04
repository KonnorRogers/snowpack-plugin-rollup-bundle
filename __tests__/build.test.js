const process = require("process");
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");

const buildDir = path.join(process.env.EXAMPLE_DIR, "build");

<<<<<<< HEAD
beforeAll(() => {
=======
beforeEach(() => {
>>>>>>> master
  childProcess.execSync(`rm -rf ${buildDir}`);
  process.chdir(process.env.EXAMPLE_DIR);
  childProcess.execSync("yarn build");
});

test("Should produce entrypoints and manifest.json", () => {
  const buildFiles = ["entrypoints", "manifest.json"].map((file) =>
    path.join(buildDir, file)
  );

  buildFiles.forEach((file) => {
    expect(fs.existsSync(file)).toBe(true);
  });
});

test("Should produce css files, including module.css files", () => {
  //
});
