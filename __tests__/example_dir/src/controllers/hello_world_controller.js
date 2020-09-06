import { Controller } from "stimulus";

export default class HelloWorldController extends Controller {
  initialize() {
    const div = document.createElement("div");
    div.id = "hello-world";
    div.innerText = "Hello World from Stimulus";
    const body = document.querySelector("body");
    body.appendChild(div);
  }
}
