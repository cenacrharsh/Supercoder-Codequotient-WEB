const signInBtn = document.getElementById("sign-in-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorNode = document.getElementById("error");

//! adding click event listener to sign in button
signInBtn.addEventListener("click", handleSignIn);

function handleSignIn(event) {
  event.preventDefault();

  errorNode.innerHTML = "";

  let email = emailInput.value;
  let password = passwordInput.value;

  let userDetails = {
    email: email,
    password: password,
  };

  sendFormDataToServer(userDetails, function () {
    window.location.replace("/");
  });
}

function sendFormDataToServer(userDetails, callback) {
  let request = new XMLHttpRequest();
  request.open("POST", "/sign-in");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(userDetails));
  request.addEventListener("load", function (event) {
    let status = event.target.status;
    if (status === 400) {
      errorNode.innerHTML = "Incorrect Email ID/Password !!";
    } else if (status === 404) {
      errorNode.innerHTML = "User Not Registered !!";
    } else if (status === 200) {
      console.log("Login Successfull!!!");
      callback();
    }
  });
}
