const usernameNode = document.getElementById("username");
const signOutBtn = document.getElementById("sign-out-btn");

//! Fetch Name of User from URL
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  usernameNode.innerHTML = name;
};

signOutBtn.addEventListener("click", handleSignOut);

function handleSignOut() {
  window.location.replace("./index.html");
}
