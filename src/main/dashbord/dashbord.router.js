const express = require("express");
const dashbordController = require("./dashbord.controller");
const dashbord_router = express.Router();
dashbord_router.get("/server-status", dashbordController.server_status);
module.exports = dashbord_router;
