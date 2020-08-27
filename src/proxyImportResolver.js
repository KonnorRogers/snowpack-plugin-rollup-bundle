// https://github.com/pikapkg/snowpack/blob/master/plugins/plugin-webpack/plugins/proxy-import-resolve.js
export function proxyImportResolver(source) {
  return source.replace(/from\s*['"].*\.(\w+)\.proxy\.js['"]/g, (fullMatch) => {
    return fullMatch.replace(".proxy.js", "");
  });
}
