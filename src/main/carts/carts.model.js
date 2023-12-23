const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
    },
    product_image: {
      type: String,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Products'
    },
    product_unit_type: String,
    product_unit: String,
    product_unit_value:Number,
    unit_flag:Number,
    quantity: {
      type: Number,

      min: [0.5, "Quantity cannot be less than 0.5."],
      default: 1,
    },
    price: {
      type: Number,
    },
    afterDiscount: Number,
    discount: Number,
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user_email: {
      type: String,
      required: true,
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

cartSchema.virtual("itemCount").get(function () {
  return this.items.length;
});

cartSchema.pre("save", function (next) {
  this.total = this.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  this.total = parseFloat(this.total.toFixed(2));
  next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
