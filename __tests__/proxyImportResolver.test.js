import { suite } from "uvu"
import * as assert from "uvu/assert"

import { proxyImportResolver } from "../src/proxyImportResolver";

const ProxyImportResolver = suite("ProxyImportResolver")

ProxyImportResolver("Should rewrite proxy statements", () => {
  const resolvedImport = proxyImportResolver("import 'x.css.proxy.js'");

  const expectedOutput = "import 'x.css'";

  assert.is(resolvedImport, expectedOutput);
});

ProxyImportResolver("Should not rewrite json proxy statements", () => {
  const resolvedImport = proxyImportResolver('import "x.json.proxy.js"');

  const expectedOutput = 'import "x.json.proxy.js"';

  assert.is(resolvedImport, expectedOutput)
});

ProxyImportResolver.run()
