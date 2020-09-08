// https://github.com/lukeed/totalist/blob/master/src/sync.js

import { resolve, join } from "path"
import * as fs from "fs"

export function totalist(dir, callback, pre='') {
  dir = resolve('.', dir);
  let arr = fs.readdirSync(dir);
  let i=0, abs, stats;
  for (; i < arr.length; i++) {
    abs = join(dir, arr[i]);
    stats = fs.statSync(abs);
    stats.isDirectory()
      ? totalist(abs, callback, join(pre, arr[i]))
      : callback(join(pre, arr[i]), abs, stats);
  }
}
