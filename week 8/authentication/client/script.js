const signInBtn = document.getElementById("sign-in-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorDiv = document.getElementById("error");

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

  sendFormDataToServer(userDetails, function () {
    window.location.replace("./home.html");
  });
}

function sendFormDataToServer(userDetails, callback) {
  console.log(userDetails);
  let request = new XMLHttpRequest();
  request.open("POST", "/sign-in");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(userDetails));
  request.addEventListener("load", function (event) {
    let status = event.target.status;
    if (status === 404) {
      errorNode.innerHTML = "User Not Registered!!";
    } else if (status === 200) {
      callback();
    }
  });
}
