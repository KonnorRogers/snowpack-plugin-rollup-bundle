import type { SnowpackPluginFactory } from "snowpack";

const plugin: SnowpackPluginFactory = () => ({
  name: "my-snowpack-plugin",
  input: [".js"],
  async build({ contents, fileExt, filePath, isDev }: any) {
    console.table({ contents, fileExt, filePath, isDev });
    return contents;
  },
});

export default plugin;
