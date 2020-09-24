import { suite } from "uvu";
import * as assert from "uvu/assert";

import { JSDOM } from "jsdom";

// import { rewriteScripts, emitHtmlFiles } from "../src/emitHtmlFiles"
import { rewriteScripts } from "../src/emitHtmlFiles";

const EmitHtmlFiles = suite("EmitHtmlFiles");

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

EmitHtmlFiles("Rewrite relative import to absolute", () => {
  const dom = createMockDom();
  const domDoc = dom.window.document;

  const firstScript = domDoc.querySelector("script");
  firstScript.src = "entrypoints/application.js";

  const newDom = rewriteScripts({ dom, manifest: mockManifest });

  const newScript = newDom.window.document.querySelector("script");
  assert.is(newScript.src, mockManifest.entrypoints.application.js);
});

EmitHtmlFiles.run();
