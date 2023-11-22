const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user_email: String,

  category: {
    type: String,
    default: "general",
  },
  link: {
    type: String,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
