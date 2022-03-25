const signUpBtn = document.getElementById("sign-up-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const errorNode = document.getElementById("error");

//! adding click event listener to sign up button
signUpBtn.addEventListener("click", handleSignUp);

function handleSignUp(event) {
  event.preventDefault();

  errorNode.innerHTML = "";

  let email = emailInput.value;
  let password = passwordInput.value;
  let confirmPassword = confirmPasswordInput.value;

  if (password === confirmPassword) {
    let userDetails = {
      email: email,
      password: password,
    };

    sendFormDataToServer(userDetails, function () {
      window.location.replace("./home.html");
    });
  } else {
    errorNode.innerHTML = "Incorrect Password!!";
  }
}

function sendFormDataToServer(userDetails, callback) {
  let request = new XMLHttpRequest();
  request.open("POST", "/sign-up");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(userDetails));
  request.addEventListener("load", function (event) {
    let status = event.target.status;
    if (status === 400) {
      errorNode.innerHTML = "User Already Exits !!";
    } else if (status === 500) {
      errorNode.innerHTML = "Error Occurred !!";
    } else if (status === 200) {
      callback();
    }
  });
}
