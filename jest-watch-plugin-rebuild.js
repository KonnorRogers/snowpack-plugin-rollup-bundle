const childProcess = require("child_process");

class JestWatchPluginRebuild {
  constructor({ config }) {
    this.command = config.command || "yarn build";
  }

  apply(jestHooks) {
    jestHook.onFileChange((change) => {
      childProcess.execSync(this.command)

    })
  }
}

module.exports = JestWatchPluginRebuild;
