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
    default_address: {
      type: String,
      required: false,
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
          product_name: {
            type: String,
            required:true
          },
          product_image: {
            type: String,
            required:true
          },
          product_quantity: {
            type: Number,
            required:true
          },
          product_unit_type: {
            type: String,
            required:true
          },
          product_unit:{
            type: String,
            required:true
          },
          product_unit_value:{
            type: Number,
            required:true
          },
          product_price: {
           type: Number,
            required:true
          },
          product_id: {
            type: String,
            required:true
          },
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
