const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
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
    pickup_time: String,
    additional_information: String,
    order_device: String,
    items: [
      new mongoose.Schema(
        {
          product_name: String,
          product_image: String,
          product_quantity: Number,
          product_price: Number,
          product_id: String,
        },
        {
          timestamps: true,
        }
      ),
    ],
  },
  {
    timestamps: true,
  }
);

const Orders = mongoose.model("Orders", OrderSchema);
module.exports = Orders;
