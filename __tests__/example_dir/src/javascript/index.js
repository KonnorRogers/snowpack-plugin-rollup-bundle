const js = {
  append: (element) => {
    const div = document.createElement("div");
    div.innerText = "hello from javascript";
    element.appendChild(div);
  },
};

export default js;
