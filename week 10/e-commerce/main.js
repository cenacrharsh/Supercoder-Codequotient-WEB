const express = require("express");
const fs = require("fs");
const multer = require("multer");
const session = require("express-session");

const app = express();

const PORT = 3000;

//# Database
const db = require("./database");

//# Importing User Model
const userModel = require("./database/models/user");

//! Initiate DB Connection
db.init();

//! Middlewares
app.use(express.static("uploads"));
app.use(express.static("assets"));
app.use(express.static("products"));
app.use(express.urlencoded());

//! Mailjet
const sendMail = require("./utils/sendMail");
const { is } = require("express/lib/request");

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
  })
);

//! Routes
app.get("/", function (req, res) {
  const user = req.session.user;

  fs.readFile("./products/products.json", "utf-8", function (err, data) {
    if (err) {
      console.log("Error in Reading Products Page !!!");
    }

    let products = JSON.parse(data);

    let requiredProducts = [];

    for (let i = 0; i < Math.min(5, products.length); i++) {
      requiredProducts.push(products[i]);
    }

    res.render("home", {
      user: user === undefined ? null : user,
      products: requiredProducts,
    });
  });
});

app.get("/get-products/:page", function (req, res) {
  const user = req.session.user;

  fs.readFile("./products/products.json", "utf-8", function (err, data) {
    if (err) {
      console.log("Error in Reading Products Page !!!");
    }

    let products = JSON.parse(data);
    let maxPage = Math.ceil(products.length / 5);

    let pageCount = req.params.page;

    console.log("maxPage", maxPage);
    console.log("page count", pageCount);

    let requiredProducts = [];

    for (let i = 0; i < Math.min(pageCount * 5, products.length); i++) {
      requiredProducts.push(products[i]);
    }

    console.log("req prod: ", requiredProducts.length);

    res.render("home", {
      user: user === undefined ? null : user,
      products: requiredProducts,
    });
  });
});

app.get("/auth", function (req, res) {
  res.render("auth");
});

app.get("/signin", function (req, res) {
  res.render("signin", { error: "" });
});

app.post("/create-session", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  userModel
    .findOne({ email: email, password: password })
    .then(function (user) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      console.log("user", user);

      res.redirect("/");
    })
    .catch(function (err) {
      console.log(err);
      res.render("signin", { error: "Incorrect Username/Password !!!" });
    });
});

app.get("/signup", function (req, res) {
  res.render("signup", { error: "" });
});

app.post("/create-user", upload.single("avatar"), function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const avatarInfo = req.file;

  if (!name) {
    res.render("signup", { error: "Please Enter Username" });
  }

  if (!email) {
    res.render("signup", { error: "Please Enter Email" });
  }

  if (!password) {
    res.render("signup", { error: "Please Enter Password" });
  }

  if (!confirmPassword) {
    res.render("signup", { error: "Please Enter Confirm Password" });
  }

  if (!avatarInfo) {
    res.render("signup", { error: "Please Upload Avatar" });
  }

  if (password !== confirmPassword) {
    res.render("signup", { error: "Passwords Don't Match" });
  }

  userModel
    .create({
      name: name,
      email: email,
      password: password,
      avatar: avatarInfo.filename,
      isVerifiedEmail: false,
    })
    .then(function () {
      let html = `<h1>Click <a href="http://localhost:3000/verifyUser/${email}">here</a> to Verify !!!</h1>`;

      sendMail(name, email, "Welcome To E-Commerce", html, function (error) {
        if (error) {
          res.render("signup", { error: "Unable to Send Email" });
        } else {
          console.log("Successfully Signed Up !!!");
          res.redirect("/signin");
        }
      });
    })
    .catch(function (err) {
      console.log(err);
      res.render("signup", { error: "Error Occured While Signing Up !!!" });
    });
});

app.get("/verifyUser/:email", function (req, res) {
  const email = req.params.email;

  userModel.findOne({ email: email }).then(function (user) {
    if (user) {
      //* Check if user is already verified
      if (user.isVerifiedEmail) {
        res.send(
          `<h1>User Already Verified, Continue to <a href = "/signin">Login !!!</a></h1>`
        );
      } else {
        //* verify user
        userModel.findOneAndUpdate(
          { email: email },
          { isVerifiedEmail: true },
          function (err, user) {
            if (err) {
              console.log("Error In Verifying User");
            } else {
              res.send(
                `<h1>User Verification Complete, Continue to <a href = "/signin">Login !!!</a></h1>`
              );
            }
          }
        );
      }
    } else {
      res.send("<h1>User Verification Failed !!!</h1>");
    }
  });
});

app.get("/destroy-session", function (req, res) {
  console.log("log out");
  req.session.destroy();
  res.redirect("/");
});

app.get("/auth", function (req, res) {
  res.render("auth");
});

app.listen(PORT, function () {
  console.log(`Server is Running on PORT :: ${PORT}`);
});
