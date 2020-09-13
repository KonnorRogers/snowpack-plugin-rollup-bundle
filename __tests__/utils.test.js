import { suite } from "uvu"
import * as assert from "uvu/assert"

import { parseHashFileName } from "../src/utils";

const ParseHashFileName = suite("ParseHashFileName")
ParseHashFileName("Should properly change a hashed file to a regular file", () => {
  const hashedFile = "abc.hash123.js";
  const parsedFile = parseHashFileName(hashedFile);
  assert.is(parsedFile, "abc.js")
});

ParseHashFileName("Should work with multiple extensions", () => {
  const hashedFile = "stuff.hash123.css.proxy.js";
  const parsedFile = parseHashFileName(hashedFile);
  assert.is(parsedFile, "stuff.css.proxy.js");
});

ParseHashFileName.run()
