const express = require("express");
const brands_router = express.Router();
const brandsController = require("./brands.controller");

brands_router.post("/brands", brandsController.createBrand);
brands_router.get("/brands", brandsController.getAllBrands);
brands_router.get("/brands/:id", brandsController.getBrandById);
brands_router.delete("/brands/:id", brandsController.deleteBrandById);
brands_router.patch("/brands/:id", brandsController.updateBrandById);

module.exports = brands_router;
