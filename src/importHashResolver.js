export function importHashResolver(source) {
  return source.replace(/from\s*['"].*\.(\w+)\.proxy\.js['"]/g, (fullMatch) => {
    return fullMatch.replace(".proxy.js", "");
  });
}
