import { proxyImportResolver } from "../src/proxyImportResolver";

test("Should rewrite proxy statements", () => {
  const resolvedImport = proxyImportResolver("import 'x.css.proxy.js'");

  const expectedOutput = "import 'x.css'";

  expect(resolvedImport).toBe(expectedOutput);
});

test("Should not rewrite json proxy statements", () => {
  const resolvedImport = proxyImportResolver('import "x.json.proxy.js"');

  const expectedOutput = 'import "x.json.proxy.js"';

  expect(resolvedImport).toBe(expectedOutput);
});
