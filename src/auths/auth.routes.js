const { authLimiter } = require("../../middleware/rateLimiter");
const { createUser, signInUser } = require("./auth.controller");

const auth_router = require("express").Router();

auth_router.post("/signup", authLimiter, createUser);
auth_router.post("/signin", authLimiter, signInUser);
module.exports = auth_router;
