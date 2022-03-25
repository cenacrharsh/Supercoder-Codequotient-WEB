const signUpBtn = document.getElementById("sign-up-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const nameInput = document.getElementById("name");
const errorNode = document.getElementById("error");

//! adding click event listener to sign up button
signUpBtn.addEventListener("click", handleSignUp);

function handleSignUp(event) {
  event.preventDefault();

  errorNode.innerHTML = "";

  let name = nameInput.value;
  let email = emailInput.value;
  let password = passwordInput.value;
  let confirmPassword = confirmPasswordInput.value;

  if (password === confirmPassword) {
    let userDetails = {
      name: name,
      email: email,
      password: password,
    };

    sendFormDataToServer(userDetails, function (name) {
      window.location.replace(`./home.html?name=${name}`);
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
      let responseText = JSON.parse(event.target.responseText);
      let name = responseText.name;
      callback(name);
    }
  });
}
