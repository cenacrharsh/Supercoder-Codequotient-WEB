console.log("prod");

const loadMoreBtnNode = document.getElementById("load-more-btn");

//# Global Variable
let pageCount = 1;

//! Adding Click Event Listener to Load More Button
loadMoreBtnNode.addEventListener("click", loadMoreBtnHandler);

function loadMoreBtnHandler(event) {
  event.preventDefault();

  pageCount++;

  let request = new XMLHttpRequest();
  request.open("GET", `/get-products/${pageCount}`);
  request.send();
  request.addEventListener("load", function (event) {
    console.log("Loaded More Products !!!");
  });
}
