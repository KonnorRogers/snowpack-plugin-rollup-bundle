const code=`body {
  background: blue;
  color: white;
}

div {
  width: 50%;
  margin: 2rem auto;
}
`,styleEl=document.createElement("style"),codeEl=document.createTextNode(code);styleEl.type="text/css",styleEl.appendChild(codeEl),document.head.appendChild(styleEl);
