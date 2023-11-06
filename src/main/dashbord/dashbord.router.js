const express = require("express");
const dashbordController = require("./dashbord.controller");
const dashbord_router = express.Router();
dashbord_router.get("/get/system/status",dashbordController.server_status);
module.exports = dashbord_router;
