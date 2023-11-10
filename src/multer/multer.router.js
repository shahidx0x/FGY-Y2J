const express = require("express");
const multer_router = express.Router();
const uploadController = require("./multer.controller");

multer_router.post("/upload", uploadController.uploadFile);
multer_router.delete("/delete-image/:imageName", uploadController.deleteImage);

module.exports = multer_router;
