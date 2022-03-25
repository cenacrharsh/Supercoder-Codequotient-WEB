const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.static("client"));

app.post("/sign-in", function (req, res) {});

app.post("/sign-up", function (req, res) {});

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
