const js = {
  append: () => {
    const div = document.createElement("div")
    div.innerText = "hello from javascript"
    document.appendChild(div)
  }
}

export default js
