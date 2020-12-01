import { parseHashFileName } from "../src/utils";

describe("Utils", () => {
  it("Should properly change a hashed file to a regular file", () => {
    const hashedFile = "abc-hash123.js";
    const parsedFile = parseHashFileName(hashedFile);
    assert.equal(parsedFile, "abc.js");
  });

  it("Should work with multiple extensions", () => {
    const hashedFile = "stuff-stuff-hash123.css.proxy.js";
    const parsedFile = parseHashFileName(hashedFile);
    assert.equal(parsedFile, "stuff-stuff.css.proxy.js");
  });
});
