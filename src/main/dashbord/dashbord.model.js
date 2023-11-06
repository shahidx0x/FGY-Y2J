const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Dashbord",
  new mongoose.Schema({
    android_user: {
      type: Number,
      trim: true,
      default: 0,
    },
    ios_user: {
      type: Number,
      trim: true,
      default: 0,
    },
    web_user: {
      type: Number,
      trim: true,
      default: 0,
    },
  })
);
