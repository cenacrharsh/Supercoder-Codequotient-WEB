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

//! Setting EJS as Default Templating Engine
app.set("view engine", "ejs");

app.listen(PORT, function () {
  console.log(`Server is Running on PORT :: ${PORT}`);
});
