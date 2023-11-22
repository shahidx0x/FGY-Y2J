const sendEmailController = require("./sendemail.controller");
const send_email_router = require("express").Router();
send_email_router.post(
  "/notify/email/admin",
  sendEmailController.new_user_registration_mail
);
send_email_router.post(
  "/notify/user/:email/:status",
  sendEmailController.user_accept_reject_email
);
send_email_router.post(
  "/notify/new/admin",
  sendEmailController.send_admin_information
);

module.exports = send_email_router;
