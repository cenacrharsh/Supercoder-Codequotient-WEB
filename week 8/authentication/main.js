const express = require("express");
const fs = require("fs");

const app = express();

const PORT = 3000;

app.use(express.static("client"));
app.use(express.json());

function read(url, callback) {
  fs.readFile(url, "utf-8", function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(data);
    }
  });
}

app.post("/sign-in", function (req, res) {
  let userDetails = req.body;
  console.log(userDetails);
  read("./db.txt", function (data) {
    if (data.hasOwnProperty("errno")) {
      res.end("Error in Reading Data from DB");
    } else {
      res.end(data);
    }
  });
});

app.post("/sign-up", function (req, res) {});

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
