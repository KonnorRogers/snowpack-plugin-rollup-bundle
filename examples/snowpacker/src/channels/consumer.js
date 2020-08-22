const consumer = {
  append: () => {
    const div = document.createElement("div")
    div.dataset.testId = "consumer"
  }
}

export default consumer
