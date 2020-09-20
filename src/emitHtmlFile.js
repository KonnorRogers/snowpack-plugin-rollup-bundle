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
      return parseHashFileName(manifest.entrypoints[fileName]["js"]);
    }
  );

  scripts.forEach((script) => {
    if (!isEntrypoint({ entrypoints: unhashedEntrypoints, script })) {
      return;
    }

    const baseFile = baseFileName(script.src);
    script.src = manifest.entrypoints[baseFile].js;

    const stylesheet = domDocument.createElement("link");
    stylesheet.href = manifest.entrypoints[baseFile].css;
    stylesheet.rel = "stylesheet";
    insertBefore(script, stylesheet);
  });

  fs.writeFileSync(destFile, dom.serialize(), "utf8");
}

function insertBefore(existingNode, newNode) {
  existingNode.parentNode.insertBefore(newNode, existingNode);
}

function isEntrypoint({ entrypoints, script }) {
  // Remove trailing slashes
  script.src.replace(/\/$/, "");

  if (entrypoints.includes(script.src)) {
    return true;
  }

  // Account for src="entrypoints/blah"
  if (entrypoints.includes("/" + script.src)) {
    script.src = "/" + script.src;
    return true;
  }

  return false;
}
