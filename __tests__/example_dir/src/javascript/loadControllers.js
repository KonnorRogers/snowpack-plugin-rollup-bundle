const glob = require("glob");
const path = require("path")

// dynamic import of stimulus controllers
function parseControllerName(fileName) {
  let { name } = path.parse(fileName);
  name = name.split("_");
  return name.slice(0, -1).join("-"); // cuts off _controller.js
}

export function loadControllers(application) {
  glob.sync("../controllers/**/*_controller.js").forEach((file) => {
      const controllerName = parseControllerName(file);
      file = "./" + path.relative(__dirname, file);

    import(file).then((module) => {
      application.register(controllerName, module.default);
    });
  });
}
