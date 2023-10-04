const express = require("express");
const CategoryController = require("./categories.controller");
const category_router = express.Router();

category_router.post("/create/category", CategoryController.createCategory);
category_router.get("/get/all/category", CategoryController.getAllCategories);
category_router.get("/get/category/by/:id", CategoryController.getCategoryById);
category_router.patch(
  "/update/category/by/:id",
  CategoryController.updateCategory
);
category_router.delete(
  "/delete/category/by/:id",
  CategoryController.deleteCategory
);

module.exports = category_router;
