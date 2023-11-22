const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
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
  },
  user_email: {
    type: String,
    default: "not-required@app.com",
  },

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
