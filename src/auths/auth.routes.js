const { authLimiter } = require("../../middleware/rateLimiter");
const authController = require("./auth.controller");
const auth_router = require("express").Router();

auth_router.get("/:cypher", authController.verify_email);
auth_router.post("/signup", authLimiter, authController.createUser);
auth_router.post("/signin", authLimiter, authController.signInUser);
auth_router.post(
  "/forgot/password/:email",
  authLimiter,
  authController.forgot_password
);
auth_router.post(
  "/verify/email/:email",
  authLimiter,
  authController.send_verify_email
);
module.exports = auth_router;
