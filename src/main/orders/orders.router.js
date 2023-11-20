const express = require("express");
const orders_controller = require("./orders.controller");
const authenticate = require("../../../middleware/authenticate");
const orders_router = express.Router();

orders_router.get("/orders", authenticate, orders_controller.get_all_orders);
orders_router.post("/orders", authenticate, orders_controller.create_new_order);
orders_router.patch(
  "/orders/:id",
  authenticate,
  orders_controller.update_order
);
orders_router.delete(
  "/orders/:id",
  authenticate,
  orders_controller.remove_order
);
module.exports = orders_router;
