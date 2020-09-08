// https://github.com/lukeed/totalist/blob/master/src/sync.js

import path from "path"
import staticFs from "static-fs"

export function totalist(dir, callback, pre = '') {
  dir = (0, path.resolve)('.', dir);
  let arr = fs.readdirSync(dir);
  let i = 0,
      abs,
      stats;

  for (; i < arr.length; i++) {
    abs = (0, path.join)(dir, arr[i]);
    stats = fs.statSync(abs);
    stats.isDirectory() ? totalist(abs, callback, (0, _path.join)(pre, arr[i])) : callback((0, path.join)(pre, arr[i]), abs, stats);
  }
}
