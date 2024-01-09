const express = require("express");
const { import_companys } = require("./imports.controller");
const imports_router = express.Router();

imports_router.post("/import/companys", import_companys);

module.exports = imports_router;
