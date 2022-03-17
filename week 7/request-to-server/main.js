let http = require("http");
let fs = require("fs");

let port = 3000;

// callback function will be called for every request recieved
let server = http.createServer(function (request, response) {
  console.log(`Request Url: ${request.url}`);
  console.log(`Request Method: ${request.method}`);

  if (request.method === "GET") {
    let requestUrl = request.url;

    switch (requestUrl) {
      case "/": {
        fs.readFile("./home.html", "utf-8", function (err, data) {
          if (err) {
            response.end("Error Occured");
          } else {
            response.end(data);
          }
        });
        break;
      }
      case "/about": {
        fs.readFile("./about.html", "utf-8", function (err, data) {
          if (err) {
            response.end("Error Occured");
          } else {
            response.end(data);
          }
        });
        break;
      }
      case "/contact": {
        fs.readFile("./contact.html", "utf-8", function (err, data) {
          if (err) {
            response.end("Error Occured");
          } else {
            response.end(data);
          }
        });
        break;
      }
      default: {
        response.end("Invalid Path");
      }
    }
  } else {
    response.end("Invalid Request");
  }
});

// starting the server, it will listen on port 3000 for requests
server.listen(port, function () {
  console.log(`Server Running on Port :: ${port}`);
});
