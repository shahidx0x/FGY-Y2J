const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    cartNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lower: true,
    },
    password: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Signup = mongoose.model("Signup", userSchema);
module.exports = Signup;
