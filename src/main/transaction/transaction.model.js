const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    items: [],
    amount: {
      type: Number,
      required: true,
    },
    deliveryStatus: {
      type: String,
    },
    purchaseStatus: {
      type: String,
    },
  },
  { totalSell: Number },
  { todayTodaySell: Number },
  { weeklyTotalSell: Number },
  { yearlyTotalSell: Number },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
