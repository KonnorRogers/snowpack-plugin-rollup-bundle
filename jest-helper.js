const { path } = import("path")
const { process } = import("process")
const { childProcess } = import("child_process")

// Set ENV Vars
process.env.EXAMPLE_DIR = path.resolve("__tests__", "example_dir")

// Run yarn install
process.chdir(process.env.EXAMPLE_DIR)
childProcess.execSync("yarn install")


