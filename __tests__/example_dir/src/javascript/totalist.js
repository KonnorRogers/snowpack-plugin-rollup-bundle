// https://github.com/lukeed/totalist/blob/master/src/sync.js

import { resolve, join } from "path"
import { readdirSync, statSync } from "fs"

export function totalist(dir, callback, pre='') {
  dir = resolve('.', dir);
  console.log(fs)
  let arr = readdirSync(dir);
  let i=0, abs, stats;
  for (; i < arr.length; i++) {
    abs = join(dir, arr[i]);
    stats = statSync(abs);
    stats.isDirectory()
      ? totalist(abs, callback, join(pre, arr[i]))
      : callback(join(pre, arr[i]), abs, stats);
  }
}
