// https://github.com/pikapkg/snowpack/blob/master/plugins/plugin-webpack/plugins/proxy-import-resolve.js
export function proxyImportResolver(source, { ext = /.*/ }) {
  const fromStatement = /from\s*['"].*\./;
  const proxyJs = /\.proxy\.js['"]/;
  const regex = new RegExp(fromStatement + ext + proxyJs, "g");
  return source.replace(regex, (fullMatch) => {
    return fullMatch.replace(".proxy.js", "");
  });
}
