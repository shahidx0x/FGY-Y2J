const sendEmailController = require("./sendemail.controller");
const send_email_router = require("express").Router();
send_email_router.post(
  "/notify/email/admin",
  sendEmailController.new_user_registration_mail
);

module.exports = send_email_router;
