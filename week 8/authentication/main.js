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
      let users = [];

      if (data.length > 0) {
        users = JSON.parse(data);
      }

      let userDetails = req.body;
      let wrongCredentials;

      users.forEach(function (user) {
        if (
          user.email === userDetails.email &&
          user.password === userDetails.password
        ) {
          res.status(200);
          res.end();
        } else {
          wrongCredentials = true;
        }
      });

      if (wrongCredentials === true) {
        res.status(400);
        res.end();
      } else {
        res.status(404);
        res.end();
      }
    }
  });
});

app.post("/sign-up", function (req, res) {
  read("./db.txt", function (data) {
    let users = [];

    if (data.length > 0) {
      users = JSON.parse(data);
    }

    let newUser = req.body;

    users.forEach(function (user) {
      if (user.email === newUser.email) {
        res.status(400);
        res.end();
      }
    });

    users.push(newUser);

    fs.writeFile("./db.txt", JSON.stringify(users), function (err) {
      if (err) {
        console.log(err);
        res.status(500);
        res.end();
      } else {
        res.status(200);
        res.end();
      }
    });
  });
});

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
