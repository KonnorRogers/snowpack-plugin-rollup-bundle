import { assert } from "@esm-bundle/chai"

import { JSDOM } from "jsdom";

// import { rewriteScripts, emitHtmlFiles } from "../src/emitHtmlFiles"
import { rewriteScripts } from "../src/emitHtmlFiles";

const mockManifest = {
  entrypoints: {
    application: {
      js: "/entrypoints/application-hash123.js",
    },
  },
};

function createMockDom() {
  return new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <script src="/entrypoints/application.js" type="module"></script>
    </head>
    <body></body>
    </html>
  `);
}

describe("EmitHtmlFiles", () => {
  it("Rewrite relative import to absolute", () => {
    const dom = createMockDom();
    const domDoc = dom.window.document;

    const firstScript = domDoc.querySelector("script");
    firstScript.src = "entrypoints/application.js";

    const newDom = rewriteScripts({
      dom,
      manifest: mockManifest,
      baseUrl: "/",
    });

    const newScript = newDom.window.document.querySelector("script");
    assert.is(newScript.src, mockManifest.entrypoints.application.js);
  });
});
