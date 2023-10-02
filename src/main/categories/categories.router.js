const express = require("express");
const CategoryController = require("./categories.controller");
const category_router = express.Router();

category_router.post("/category", CategoryController.createCategory);
category_router.get("/category", CategoryController.getAllCategories);
category_router.get("/category/:id", CategoryController.getCategoryById);
category_router.patch("/category/:id", CategoryController.updateCategory);
category_router.delete("/category/:id", CategoryController.deleteCategory);

module.exports = category_router;
