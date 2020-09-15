import { Controller } from "stimulus";

export default class HelloWorldController extends Controller {
  initialize() {
    const _element = this.element
    _element.dataset.testId = "hello-world";
    _element.innerText = "Hello World from Stimulus";
    const body = document.querySelector("body");
    body.appendChild(_element);
  }
}
