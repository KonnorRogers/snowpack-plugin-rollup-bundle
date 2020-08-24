import JS from "../javascript";
import * as channels from "../channels";
import "../stylesheets/index.css";
import jsonFile from "../assets/x.json"

document.addEventListener("DOMContentLoaded", () => {
  const div = document.createElement("div");
  div.innerText = jsonFile;

  const body = document.querySelector("body")
  body.appendChild(div);

  JS.append(body);
  channels.consumer.append(body);
});
