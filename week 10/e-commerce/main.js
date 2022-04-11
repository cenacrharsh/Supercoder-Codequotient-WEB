const express = require("express");
const fs = require("fs");
const multer = require("multer");
const session = require("express-session");

const app = express();

const PORT = 3000;

//# Database
const db = require("./database");

//! Initiate DB Connection
db.init();

//# Importing User Model
const userModel = require("./database/models/user");

//! Middlewares
app.use(express.static("uploads"));
app.use(express.urlencoded());

//! Multer
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

//! Setting EJS as Default Templating Engine
app.set("view engine", "ejs");

//! Setting up Express Session
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/signin")
  .get(function (req, res) {
    res.render("signin", { error: "" });
  })
  .post(function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    userModel
      .findOne({ username: username, password: password })
      .then(function (user) {
        req.session.isLoggedIn = true;
        req.session.user = user;

        res.redirect("/products");
      })
      .catch(function (err) {
        console.log(err);
        res.render("signin", { error: "Incorrect Username/Password !!!" });
      });
  });

app
  .route("/signup")
  .get(function (req, res) {
    res.render("signup", { error: "" });
  })
  .post(upload.single("avatar"), function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const avatarInfo = req.file;
    console.log(username, password, avatar);

    if (!username) {
      res.render("signup", { error: "Please Enter Username" });
    }

    if (!password) {
      res.render("signup", { error: "Please Enter Password" });
    }

    if (!avatar) {
      res.render("signup", { error: "Please Upload Avatar" });
    }

    userModel
      .create({
        username: username,
        password: password,
        avatar: avatarInfo.filename,
      })
      .then(function () {
        console.log("Successfully Signed Up !!!");
        res.redirect("/signin");
      })
      .catch(function (err) {
        console.log(err);
        res.render("signup", { error: "Error Occured While Signing Up !!!" });
      });
  });

app.get("/products", function (req, res) {
  const user = req.session.user;

  fs.readFile("./products.js", "utf-8", function (err, data) {
    if (err) {
      console.log("Error in Reading Products Page !!!");
    }
    res.render("products", {
      username: user.username,
      avatar: user.avatar,
      products: data,
    });
  });
});

app.listen(PORT, function () {
  console.log(`Server is Running on PORT :: ${PORT}`);
});
