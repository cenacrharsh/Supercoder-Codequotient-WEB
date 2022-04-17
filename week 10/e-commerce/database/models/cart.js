const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      default: "",
    },
    product_image: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;
