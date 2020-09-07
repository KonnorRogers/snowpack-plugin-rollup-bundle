import path from "path"

// dynamic import of stimulus controllers
export function parseControllerName(fileName) {
  let { name } = path.parse(fileName);
  name = name.split("_");
  return name.slice(0, -1).join("-"); // cuts off _controller.js
}
