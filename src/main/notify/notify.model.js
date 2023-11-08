const mongoose = require("mongoose");

const notifySchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    user_address: {
      type: String,
      required: true,
    },
    order_status: {
      type: Number,
      default: 0,
    },
    order_device: String,
    orders: [
      new mongoose.Schema({
        product_name: String,
        product_image: String,
        product_quantity: Number,
        product_price: Number,
        product_id: String,
        order_status: {
          type: String,
          default: "0",
        },
      }),
    ],
  },
  {
    timestamps: true,
  }
);

const Notify = mongoose.model("Notify", notifySchema);
module.exports = Notify;
