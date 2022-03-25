const signOutBtn = document.getElementById("sign-out-btn");

signOutBtn.addEventListener("click", handleSignOut);

function handleSignOut() {
  window.location.replace("./index.html");
}
