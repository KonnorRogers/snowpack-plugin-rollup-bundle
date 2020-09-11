import JS from "../javascript";
import * as channels from "../channels";
import "../stylesheets/index.css";
import jsonFile from "../assets/x.json"
import logo from "../assets/logo.svg"
import SmallHouse from "../assets/small-house.png"

// WIP
// import styles from "../stylesheets/button.module.css"
// import { greenButton } from "../stylesheets/button.module.css"
// console.log(greenButton)

// Stimulus
import { parseControllerName } from "../javascript/parseControllerName"
import importAll from "import-all.macro"
import { Application } from "stimulus";

const application = Application.start();

const imports = importAll.sync("../controllers/*_controller.js")
for (const [fileName, importedModule] of Object.entries(imports)) {
  const controllerName = parseControllerName(fileName)
  application.register(controllerName, importedModule.default)
}

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

  // const btn = document.createElement("button")
  // btn.className = greenButton
  // body.appendChild(btn)
});
