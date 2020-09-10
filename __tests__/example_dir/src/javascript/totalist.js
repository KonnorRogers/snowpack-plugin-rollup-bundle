// https://github.com/lukeed/totalist/blob/master/src/sync.js

import path from "path"
import { readdirSync, statSync } from "browserify-fs"

export function totalist(dir, callback, pre = '') {
  dir = (0, path.resolve)('.', dir);
  let arr = readdirSync(dir);
  let i = 0,
      abs,
      stats;

  for (; i < arr.length; i++) {
    abs = (0, path.join)(dir, arr[i]);
    stats = statSync(abs);
    stats.isDirectory() ? totalist(abs, callback, (0, path.join)(pre, arr[i])) : callback((0, path.join)(pre, arr[i]), abs, stats);
  }
}
