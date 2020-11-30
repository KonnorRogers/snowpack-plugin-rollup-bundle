import { assert } from "chai";

import { proxyImportResolver } from "../src/proxyImportResolver";

describe("ProxyImportResolver", () => {
  it("Should rewrite proxy statements", () => {
    const resolvedImport = proxyImportResolver("import 'x.css.proxy.js'");

    const expectedOutput = "import 'x.css'";

    assert.equal(resolvedImport, expectedOutput);
  });

  it("Should not rewrite json proxy statements", () => {
    const resolvedImport = proxyImportResolver('import "x.json.proxy.js"');

    const expectedOutput = 'import "x.json.proxy.js"';

    assert.equal(resolvedImport, expectedOutput);
  });
});
