const express = require("express");
const brands_router = express.Router();
const brandsController = require("./brands.controller");
const authenticate = require("../../../middleware/authenticate");

brands_router.post(
  "/create/brands",
  authenticate,

  brandsController.createBrand
);
brands_router.get(
  "/get/all/brands",
  authenticate,

  brandsController.getAllBrands
);
brands_router.get(
  "/get/all/brands/search",
  authenticate,

  brandsController.getAllBrandsSearch
);
brands_router.get(
  "/get/all/brands/id/and/name",
  authenticate,

  brandsController.getAllBrandsIdandName
);
brands_router.get(
  "/get/brands/by/:id",
  authenticate,

  brandsController.getBrandById
);
brands_router.delete(
  "/delete/brands/by/:id",
  authenticate,

  brandsController.deleteBrandById
);
brands_router.patch(
  "/update/brands/by/:id",
  authenticate,

  brandsController.updateBrandById
);

module.exports = brands_router;
