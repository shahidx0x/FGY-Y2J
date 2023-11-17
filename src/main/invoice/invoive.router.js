const invoiceController = require("./invoice.controller");
const invoice_router = require("express").Router();
invoice_router.post("/product/invoice/:email", invoiceController.gen_invoice);
invoice_router.post("/send/order-status", invoiceController.order_status);
module.exports = invoice_router;
