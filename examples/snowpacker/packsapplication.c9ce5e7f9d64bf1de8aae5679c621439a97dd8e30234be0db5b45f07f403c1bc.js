import JS from "../javascript/index.js";
import * as channels from "../channels/index.js";
import "../stylesheets/index.css.proxy.js";
import jsonFile from "../assets/x.json.proxy.js"

document.addEventListener("DOMContentLoaded", () => {
  const div = document.createElement("div");
  div.innerText = jsonFile;

  const body = document.querySelector("body")
  body.appendChild(div);

  JS.append(body);
  channels.consumer.append(body);
});
