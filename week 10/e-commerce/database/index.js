module.exports.init = function () {
  const mongoose = require("mongoose");

  mongoose
    .connect(
      "mongodb+srv://harsh:harsh@cluster0.tobfw.mongodb.net/eCommerce?retryWrites=true&w=majority"
    )
    .then(function () {
      console.log("DB is Connected !!!");
    })
    .catch(function () {
      console.log("Error in DB Connection");
    });
};
