import { parseHashFileName } from "../src/utils";

describe("parseHashFileName", () => {
  test("Should properly change a hashed file to a regular file", () => {
    const hashedFile = "abc.hash123.js";
    const parsedFile = parseHashFileName(hashedFile);
    expect(parsedFile).toEqual("abc.js");
  });

  test("Should work with multiple extensions", () => {
    const hashedFile = "stuff.hash123.css.proxy.js";
    const parsedFile = parseHashFileName(hashedFile);
    expect(parsedFile).toEqual("stuff.css.proxy.js");
  });
});
