const authenticate = require("../../middleware/authenticate");
const { authLimiter } = require("../../middleware/rateLimiter");
const authController = require("./auth.controller");
const auth_router = require("express").Router();

auth_router.get("/verify/email/:cypher", authController.verify_email);
auth_router.get("/get/users", authenticate, authController.getAllUsers);
auth_router.get("/get/user", authenticate, authController.getUserByEmail);
auth_router.post("/signup", authLimiter, authController.createUser);
auth_router.post("/signin", authLimiter, authController.signInUser);
auth_router.post("/reset-password", authLimiter, authController.resetPassword);
auth_router.post(
  "/verify/refresh/token",
  authLimiter,
  authController.verify_refresh_token
);
auth_router.patch(
  "/user/info/update",
  authenticate,
  authLimiter,
  authController.updateUser
);
auth_router.post(
  "/forgot/password/:email",
  authLimiter,
  authController.forgot_password
);
auth_router.post("/gen/invoice", authLimiter, authController.gen_invoice);
auth_router.post(
  "/send/verification",
  authLimiter,
  authController.send_verification_email
);
auth_router.post("/verify/otp", authLimiter, authController.verify_otp);
auth_router.get("/check/session", authenticate, authController.checkSession);
auth_router.delete(
  "/remove/user/:id",
  authenticate,
  authController.remove_user
);
module.exports = auth_router;
