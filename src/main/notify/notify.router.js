const express = require("express");
const notifyController = require("./notify.controller");
const notify_router = express.Router();

notify_router.post("/get/notication", notifyController.getAllNotifies);
notify_router.post("/notify/to/admin", notifyController.createNotify);
notify_router.delete(
  "/remove/notification/:id",
  notifyController.removeNotifyById
);
module.exports = notify_router;
