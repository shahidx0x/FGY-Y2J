const express = require("express");
const SubCategoryController = require("./subcategories.controller");
const subcat_router = express.Router();

subcat_router.get(
  "/get/all/subcat/:categoryId",
  SubCategoryController.getAllSubCategories
);

subcat_router.post(
  "/create/subcategory/:categoryId",
  SubCategoryController.addSubCategory
);
subcat_router.patch(
  "/subcategory/:categoryId/:subCategoryId",
  SubCategoryController.updateSubCategory
);
subcat_router.delete(
  "/subcategory/:categoryId/:subCategoryId",
  SubCategoryController.deleteSubCategory
);

module.exports = subcat_router;
