const signInBtn = document.getElementById("sign-in-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

//! adding click event listener to sign in button
signInBtn.addEventListener("click", handleSignIn);

function handleSignIn(event) {
  event.preventDefault();

  let email = emailInput.value;
  let password = passwordInput.value;
  console.log(email, password);

  let userDetails = {
    email: email,
    password: password,
  };

  sendFormDataToServer(userDetails, function () {});
}

function sendFormDataToServer(userDetails, callback) {
  console.log(userDetails);
  let request = new XMLHttpRequest();
  request.open("POST", "/sign-in");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(userDetails));
  request.addEventListener("load", function () {
    console.log("data sent to server");
  });
}
