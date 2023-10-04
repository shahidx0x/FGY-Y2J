const express = require("express");
const brands_router = express.Router();
const brandsController = require("./brands.controller");
const authenticate = require("../../../middleware/authenticate");

brands_router.post(
  "/create/brands",

  brandsController.createBrand
);
brands_router.get(
  "/get/all/brands",

  brandsController.getAllBrands
);
brands_router.get(
  "/get/brands/by/:id",

  brandsController.getBrandById
);
brands_router.delete(
  "/delete/brands/by/:id",

  brandsController.deleteBrandById
);
brands_router.patch(
  "/update/brands/by/:id",

  brandsController.updateBrandById
);

module.exports = brands_router;
