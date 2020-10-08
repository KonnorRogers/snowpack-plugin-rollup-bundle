import fs from "fs";
import path from "path";
import { parseHashFileName } from "./utils";
import { JSDOM } from "jsdom";

/**
 * An instance of JSDOM
 * @typedef {string} JSDOM
 */

/**
 * A manifest file parsed to an Object
 * @typedef {Object} ManifestObject
 */

/**
 * Rewrites the values of scripts and extrapolates the css file
 *   associated with the script.
 *
 * @param {Object} params
 * @param {string} params.file - Path to a file
 * @param {ManifestObject} params.manifest - Manifest Object
 * @param {string} params.destFile - Path to the new file
 * @returns {undefined}
 */
export function emitHtmlFiles({ file, manifest, destFile, buildDirectory }) {
  const fileContents = fs.readFileSync(file, { encoding: "utf8" });

  const dom = new JSDOM(fileContents, {
    includeNodeLocations: true,
  });

  const newDom = rewriteScripts({ dom, manifest, buildDirectory });

  fs.writeFileSync(destFile, newDom.serialize(), "utf8");
}

/**
 * Rewrites the scripts of a given JSDOM instance to use files from the manifest
 * @param {Object} params
 * @param {JSDOM} params.dom - An instance of JSDOM
 * @param {ManifestObject} params.manifest - Manifest file parsed to Object
 * @returns {string} Returns a string from serializing JSDOM
 */
export function rewriteScripts({ dom, manifest, buildDirectory }) {
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
    const baseFile = path.parse(script.src).name;
    script.src = manifest.entrypoints[baseFile].js

    const stylesheet = domDocument.createElement("link");
    stylesheet.href = manifest.entrypoints[baseFile].css;
    stylesheet.rel = "stylesheet";
    insertBefore(script, stylesheet);
  });

  return dom;
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
