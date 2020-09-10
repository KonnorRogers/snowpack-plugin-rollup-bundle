/**
* Parse a filename and return the controller name without _controller.js
* @param fileName [String] - The fileName to parse
* @return [String] - Returns a string without _controller.js
* @example
*  const name = parseControllerName("rails/controllers/hello_world_controller.js")
*  console.log(name) // => hello_world
*/
export function parseControllerName(fileName) {
  const regexp = /(\w+) _controller\.js/
  // fileName.match(regexp)[0] returns ${x}_controller.js
  return fileName.match(regexp)[1]
}
