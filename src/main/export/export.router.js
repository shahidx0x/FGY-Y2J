const express = require("express");
const exportController = require("./export.controller");
const export_router = express.Router();

export_router.get("/export/brands", exportController.export_brands);
module.exports = export_router;
