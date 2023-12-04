const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  imageUrl: String,
  appUrl:String
})
const actionSchema = new mongoose.Schema({
  actionType: String,
  otherData:String
})
const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  title: String,
  data: dataSchema,
  color: String,
  bgColor: String,
  priority: String,
  action:actionSchema,
  date: {
    type: Date,
    default: Date.now,
  },
  isRecent: Boolean,
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
