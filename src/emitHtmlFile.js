import fs from "fs";
// import path from "path"

import { parseHashFileName } from "./utils";
import { baseFileName } from "./manifestUtils";

import { JSDOM } from "jsdom";

/**
 * Currently this exists for testing purposes only
 */
export function emitHtmlFile({ file, manifest, destFile }) {
  const fileContents = fs.readFileSync(file, { encoding: "utf8" });
  const dom = new JSDOM(fileContents, {
    includeNodeLocations: true,
  });

  const domDocument = dom.window.document;

  const scripts = domDocument.querySelectorAll("script");

  const unhashedEntrypoints = Object.keys(manifest.entrypoints).map(
    (fileName) => {
      console.log(parseHashFileName(manifest.entrypoints[fileName]["js"]));
      return parseHashFileName(manifest.entrypoints[fileName]["js"]);
    }
  );

  scripts.forEach((script) => {
    console.log(script.src);
    if (!unhashedEntrypoints.includes(script.src)) {
      return;
    }

    const baseFile = baseFileName(script.src);
    console.log("make it here?");
    script.src = manifest.entrypoints[baseFile].js;
  });

  fs.writeFileSync(destFile, dom.serialize(), "utf8");
}
