import JS from "../javascript";
import * as channels from "../channels";
import "../stylesheets/index.css";

document.addEventListener("DOMContentLoaded", () => {
  const div = document.createElement("div");
  div.innerText = "Hello from index";

  const body = document.querySelector("body")
  body.appendChild(div);

  JS.append(body);
  channels.consumer.append(body);
});
