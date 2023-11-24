const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signup",
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
    totalCost: { type: Number, default: 0 },
  },

  {
    timestamps: true,
  }
);
OrderSchema.pre("save", function (next) {
  this.totalCost = this.items.reduce((total, item) => {
    return total + item.product_quantity * item.product_price;
  }, 0);
  this.totalCost = parseFloat(this.totalCost.toFixed(2));
  next();
});

const Orders = mongoose.model("Orders", OrderSchema);
module.exports = Orders;
