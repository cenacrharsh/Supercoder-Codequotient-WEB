//! View Description

//* Get All the Modal
var modal = document.getElementsByClassName("modal");

//* Get all the button that opens the modal
var btn = document.getElementsByClassName("myBtn");

//* Get all the <span> element that closes the modal
var span = document.getElementsByClassName("close");

//* When the user clicks on the button, open the modal
for (let i = 0; i < btn.length; i++) {
  btn[i].onclick = function () {
    modal[i].style.display = "block";
  };
}

//* When the user clicks on <span> (x), close the modal
for (let i = 0; i < span.length; i++) {
  span[i].onclick = function () {
    modal[i].style.display = "none";
  };
}

//! Add To Cart
var addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

//* add click event listener to add to cart btn
for (let i = 0; i < addToCartBtns.length; i++) {
  addToCartBtns[i].onclick = function (event) {
    let productContainerDivNode = event.target.parentNode.parentNode;
    let addToCartBtn = productContainerDivNode.children[3].children[0];
    let productId = productContainerDivNode.getAttribute("id");

    handleAddToCart(productId, addToCartBtn);
  };
}

function handleAddToCart(productId, button) {
  var request = new XMLHttpRequest();
  request.open("POST", `/add-to-cart`);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({ productId: productId }));
  request.addEventListener("load", function (event) {
    if (request.status === 401) {
      alert("Please Login To Add Products To Cart !!!");
      window.location.href = "/auth";
    } else if (request.status === 200) {
      button.disabled = true;
      button.style.backgroundColor = "lightgrey";
      console.log("Product Added To Cart Successfully !!!");
    }
  });
}
