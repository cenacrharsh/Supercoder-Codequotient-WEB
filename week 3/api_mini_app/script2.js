//! for images

var postContainer = document.getElementById("postContainer");

function getData() {
  var request = new XMLHttpRequest();

  request.open("GET", "https://jsonplaceholder.typicode.com/photos");

  request.send();

  request.addEventListener("load", function (event) {
    var data = JSON.parse(event.target.responseText);

    console.log(data);

    genratePostList(data);
  });
}

function genratePostList(posts) {
  postContainer.innerHTML = "";

  posts.forEach(function (post) {
    createPost(post);
  });
}

function createPost(post) {
  var container = document.createElement("div");

  var title = document.createElement("h4");
  title.innerHTML = post.title;

  container.appendChild(title);

  var body = document.createElement("img");
  body.src = post.thumbnailUrl;

  container.appendChild(body);

  var button = document.createElement("button");
  button.innerHTML = "Comments";

  button.onclick = function (event) {
    getComments(post.url);
  };

  container.appendChild(button);

  var line = document.createElement("hr");
  container.appendChild(line);

  postContainer.appendChild(container);
}

function getComments(imageUrl) {
  displayComment(imageUrl);
}

function displayComment(imageUrl) {
  // clear post container
  postContainer.innerHTML = "";

  var image = document.createElement("img");
  image.src = imageUrl;

  postContainer.appendChild(image);

  var closeButton = document.createElement("button");
  closeButton.innerHTML = "close";

  closeButton.addEventListener("click", getData);

  postContainer.appendChild(closeButton);
}

setTimeout(function () {
  getData();
}, 0);
