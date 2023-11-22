const express = require("express");
const notification_controller = require("./notification.controller");
const authenticate = require("../../../middleware/authenticate");
const notification_router = express.Router();

notification_router.get(
  "/notifications",
  authenticate,
  notification_controller.getAllNotifications
);
notification_router.post(
  "/notifications",
  authenticate,
  notification_controller.createNotification
);
notification_router.patch(
  "/notifications",
  authenticate,
  notification_controller.updateNotificationById
);
module.exports = notification_router;
