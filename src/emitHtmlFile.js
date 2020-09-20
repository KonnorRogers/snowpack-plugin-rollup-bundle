import fs from "fs";
// import path from "path"

import { parseHashFileName } from "./utils";
import * as manifestUtils from "./manifestUtils";

import { JSDOM } from "jsdom";

/**
 * Currently this exists for testing purposes only
 */
export function emitHtmlFile({ file, manifest }) {
  const fileContents = fs.readFileSync(file, { encoding: "utf8" });
  const dom = new JSDOM(
    fs.readFileSync(fileContents, {
      includeNodeLocations: true,
    })
  );

  const domDocument = dom.window.document;

  const scripts = domDocument.querySelectorAll("script");

  const unhashedEntrypoints = Object.keys(manifest.entrypoints).map(
    (fileName) => {
      return parseHashFileName(fileName["js"]);
    }
  );

  scripts.forEach((script) => {
    if (!unhashedEntrypoints.includes(script.src)) {
      return;
    }

    const baseFile = manifestUtils.baseFileName(script.src);
    script.src = manifest.entrypoints[baseFile].js;
  });

  console.log(dom.serialize());
  fs.writeFileSync(file, dom.serialize());
}
