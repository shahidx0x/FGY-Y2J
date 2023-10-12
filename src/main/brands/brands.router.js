const express = require("express");
const brands_router = express.Router();
const brandsController = require("./brands.controller");
const authenticate = require("../../../middleware/authenticate");

brands_router.post(
  authenticate,
  "/create/brands",

  brandsController.createBrand
);
brands_router.get(
  authenticate,
  "/get/all/brands",

  brandsController.getAllBrands
);
brands_router.get(
  authenticate,
  "/get/brands/by/:id",

  brandsController.getBrandById
);
brands_router.delete(
  authenticate,
  "/delete/brands/by/:id",

  brandsController.deleteBrandById
);
brands_router.patch(
  authenticate,
  "/update/brands/by/:id",

  brandsController.updateBrandById
);

module.exports = brands_router;
