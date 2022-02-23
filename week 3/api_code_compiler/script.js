const submitButton = document.getElementById("submitButton");

const textArea = document.getElementById("input");

submitButton.addEventListener("click", (event) => {
  let code = textArea.value;
  console.log(code);
});
