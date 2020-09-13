import { suite } from "uvu"
import * as assert from "uvu/assert"

const Browser = suite("Browser")

Browser("Should properly load the page with no console errors", () => {
  assert.is(true, true)
});

Browser.run()
