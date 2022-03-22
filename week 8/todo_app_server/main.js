const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
