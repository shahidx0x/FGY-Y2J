const { authLimiter } = require("../../middleware/rateLimiter");
const authController = require("./auth.controller");
const auth_router = require("express").Router();

auth_router.get("/verify/email/:cypher", authController.verify_email);
auth_router.get("/get/users", authController.getAllUsers);
auth_router.get("/get/user", authController.getUserByEmail);
auth_router.post("/signup", authLimiter, authController.createUser);
auth_router.post("/signin", authLimiter, authController.signInUser);
auth_router.patch("/user/info/update", authLimiter, authController.updateUser);
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
