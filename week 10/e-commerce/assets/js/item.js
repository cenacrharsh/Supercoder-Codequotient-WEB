// Get All the Modal
var modal = document.getElementsByClassName("modal");

// Get all the button that opens the modal
var btn = document.getElementsByClassName("myBtn");

// Get all the <span> element that closes the modal
var span = document.getElementsByClassName("close");

// When the user clicks on the button, open the modal
for (let i = 0; i < btn.length; i++) {
  btn[i].onclick = function () {
    modal[i].style.display = "block";
  };
}

// When the user clicks on <span> (x), close the modal
for (let i = 0; i < span.length; i++) {
  span[i].onclick = function () {
    modal[i].style.display = "none";
  };
}
