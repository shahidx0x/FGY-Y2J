const express = require("express");
const orders_controller = require("./orders.controller");
const orders_router = express.Router();

orders_router.get("/orders", orders_controller.get_all_orders);
orders_router.post("/orders", orders_controller.create_new_order);
orders_router.delete("/orders/:id", orders_controller.remove_order);
module.exports = orders_router;
