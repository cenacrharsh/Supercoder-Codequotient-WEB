var postContainer = document.getElementById("postContainer");

function getData() {
  var request = new XMLHttpRequest();

  request.open("GET", "https://jsonplaceholder.typicode.com/posts");

  request.send();

  request.addEventListener("load", function (event) {
    var data = JSON.parse(event.target.responseText);

    //console.log(data)

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

  var body = document.createElement("p");
  body.innerHTML = post.body;

  container.appendChild(body);

  var button = document.createElement("button");
  button.innerHTML = "Comments";

  button.onclick = function (event) {
    getComments(post.id);
  };

  container.appendChild(button);

  var line = document.createElement("hr");
  container.appendChild(line);

  postContainer.appendChild(container);
}

function getComments(postId) {
  var request = new XMLHttpRequest();

  request.open(
    "GET",
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );

  request.send(JSON.stringify({ data: "ok" }));

  request.addEventListener("load", function () {
    var comments = JSON.parse(request.responseText);

    displayComment(comments);
  });
}

function displayComment(comments) {
  // clear post container
  postContainer.innerHTML = "";

  /* var length = postContainer.children.length

  for( var i=0; i<length ; i++ )
  {
    postContainer.removeChild(postContainer.children[i]);
  } */

  comments.forEach(function (comment) {
    var commentContainer = document.createElement("div");

    var userName = document.createElement("h2");
    userName.innerHTML = comment.name;

    commentContainer.appendChild(userName);

    var commentBody = document.createElement("p");
    commentBody.innerHTML = comment.body;

    commentContainer.appendChild(commentBody);

    postContainer.appendChild(commentContainer);
  });

  var closeButton = document.createElement("button");
  closeButton.innerHTML = "close";

  closeButton.addEventListener("click", getData);

  postContainer.appendChild(closeButton);
}

setTimeout(function () {
  getData();
}, 5000);
