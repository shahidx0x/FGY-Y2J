const transactionController = require("./transaction.controller");
const transaction_router = require("express").Router();
transaction_router.post(
  "/create/transaction",
  transactionController.crate_transaction
);
transaction_router.get("/transaction", transactionController.transaction_list);
transaction_router.patch(
  "/update/transaction",
  transactionController.update_transaction
);
module.exports = transaction_router;
