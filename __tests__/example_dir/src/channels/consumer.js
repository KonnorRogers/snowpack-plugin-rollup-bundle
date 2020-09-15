const consumer = {
  append: (element) => {
    const div = document.createElement("div")
    div.dataset.testId = "channels-consumer"
    div.innerText = "hello from channels"
    element.appendChild(div)
  }
}

export default consumer
