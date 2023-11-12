const express = require("express");
const cartController = require("./carts.controller");
const authenticate = require("../../../middleware/authenticate");

const carts_router = express.Router();

carts_router.post("/add/cart/item", authenticate, cartController.addItem);
carts_router.get("/get/cart/user/:user_email", cartController.getUserCart);
carts_router.delete("/remove/cart/item", cartController.removeItem);
carts_router.delete("/empty/cart/:user_email", cartController.emptyCart);
carts_router.patch("/update/cart/item", cartController.updateItemQuantity);

module.exports = carts_router;
