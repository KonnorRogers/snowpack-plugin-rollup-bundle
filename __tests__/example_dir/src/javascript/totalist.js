// https://github.com/lukeed/totalist/blob/master/src/sync.js

import path from "path"
const fs = require("fs")

export function totalist(dir, callback, pre='') {
  dir = path.resolve('.', dir);
  console.log(fs)
  let arr = fs.readdirSync(dir);
  let i=0, abs, stats;
  for (; i < arr.length; i++) {
    abs = path.join(dir, arr[i]);
    stats = fs.statSync(abs);
    stats.isDirectory()
      ? totalist(abs, callback, join(pre, arr[i]))
      : callback(join(pre, arr[i]), abs, stats);
  }
}
