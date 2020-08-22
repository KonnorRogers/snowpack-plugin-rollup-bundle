import JS from "../javascript";
import { consumer } from "../channels";
import "../stylesheets/index.css";

document.addEventListener("DOMContentLoaded", () => {
  const div = document.createElement("div");
  div.innerText = "Hello from index";
  document.appendChild(div);

  JS.append();
  consumer.append();
});
