const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Dashbord",
  new mongoose.Schema({
    android_user: {
      type: Number,
      trim: true,
    },
    ios_user: {
      type: Number,
      trim: true,
    },
    server_status: [
      new mongoose.Schema({
        cpu: Number,
        memory: Number,
        disk: Number,
      }),
    ],
  })
);
