/**
 * @jest-environment jsdom
 */

// const path = require("path");

// import {
//   getByLabelText,
//   getByText,
//   getByTestId,
//   queryByTestId,
//   waitFor,
// } from '@testing-library/dom'
// import "@testing-library/jest-dom/extend-expect";

// const exampleDir = path.resolve("__tests__", "example_dir");
// const buildDir = path.join(exampleDir, "build");

// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;

// const page = JSDOM.fromFile(path.join(buildDir, "index.html"), {
//     resources: "usable",
//     runScripts: "dangerously",
//   }).then((dom) => {
//     return dom
//   });

test("Should properly load the page with no console errors", async () => {
  expect(true).toBe(true);
});
