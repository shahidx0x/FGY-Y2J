const invoiceController = require("./invoice.controller");
const invoice_router = require("express").Router();
invoice_router.post("/product/invoice/:email", invoiceController.gen_invoice);
module.exports = invoice_router;
