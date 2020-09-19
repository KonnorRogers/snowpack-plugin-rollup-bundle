import fs from "fs"
import path from "path"

import { parseHashFileName } from "./utils"
import * as manifestUtils from "./manifestUtils"

import { JSDOM } from "jsdom"

export function emitHtmlFile({file, manifest}) {
  const fileContents = fs.readFileSync(file, {encoding: "utf8"})
  const dom = new JSDOM(fs.readFileSync(fileContents, {
    includeNodeLocations: true
  }))

  const domDocument = dom.window.document

  const scripts = domDocument.querySelectorAll("script");

  const entrypoints = scripts.filter((script) => {
    let scriptSrc = script.src

    if (entrypointExists({file: scriptSrc, manifest})) {
      return script
    }

    return
  })

  return dom.serialize()
}

function entrypointExists({file, manifest}) {
  const { name } = path.parse(file)
  const hashedFile = manifest.entrypoints[name].js
  const unhashedFile = parseHashFileName(hashedFile)

  if (unhashedFile === name || unhashedFile === "/" + name) {
    return true
  }

  return false
}
