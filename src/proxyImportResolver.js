// https://github.com/pikapkg/snowpack/blob/master/plugins/plugin-webpack/plugins/proxy-import-resolve.js
export function proxyImportResolver(source) {
  const regex = /from\s*['"].*\.(\w+)\.proxy\.js['"]/g;
  return source.replace(regex, (fullMatch, originalExt) => {
    if (originalExt === "json") {
      return fullMatch;
    }

    return fullMatch.replace(".proxy.js", "");
  });
}
