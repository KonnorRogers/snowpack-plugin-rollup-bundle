import JS from "../javascript";
import * as channels from "../channels";
import "../stylesheets/index.css";
import jsonFile from "../assets/x.json"
import logo from "../assets/logo.svg"
import SmallHouse from "../assets/small-house.png"

import { Application } from "stimulus";

const glob = require("glob");
const path = require("path")

// dynamic import of stimulus controllers
function parseControllerName(fileName) {
  let { name } = path.parse(fileName);
  name = name.split("_");
  return name.slice(0, -1).join("-"); // cuts off _controller.js
}

const application = Application.start();

glob.sync("./src/controllers/**/*_controller.js").forEach((file) => {
  const controllerName = parseControllerName(file);
  file = "./" + path.relative(__dirname, file);

  import(file).then((module) => {
    application.register(controllerName, module.default);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const img = document.createElement("img")
  img.src = logo
  img.alt = "logo"
  img.className = "logo"
  img.height = 200
  img.width = 200

  const div = document.createElement("div");
  div.innerText = jsonFile.y;

  const body = document.querySelector("body")
  body.appendChild(div);
  body.appendChild(img)

  JS.append(body);
  channels.consumer.append(body);

  const smallHouse = document.createElement("img")
  smallHouse.src = SmallHouse
  smallHouse.alt = "apple image"
  smallHouse.className = "apple-image"
  smallHouse.height = 200
  smallHouse.width = 200
  body.appendChild(smallHouse)
});
