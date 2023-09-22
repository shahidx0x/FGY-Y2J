const {
  getCategories,
  addCategories,
  addSubcategoryById,
  deleteSubcategory,
} = require("./products.controller");

const products_router = require("express").Router();

products_router.get("/products", getCategories);
products_router.post("/products", addCategories);
products_router.post("/products/:categoryId/subcategories", addSubcategoryById);
products_router.delete(
  "/products/:categoryId/subcategories/:subcategoryId",
  deleteSubcategory
);

module.exports = products_router;
