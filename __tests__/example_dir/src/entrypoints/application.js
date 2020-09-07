import JS from "../javascript";
import * as channels from "../channels";
import "../stylesheets/index.css";
import jsonFile from "../assets/x.json"
import logo from "../assets/logo.svg"
import SmallHouse from "../assets/small-house.png"
import { loadControllers } from "../javascript/loadControllers"

import { Application } from "stimulus";

const application = Application.start();

loadControllers(application)


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
