const {
  getCategories,
  addCategories,
  addSubcategoryById,
  deleteSubcategory,
  updateSubcategory,
  deleteCategory,
} = require("./products.controller");

const products_router = require("express").Router();

products_router.get("/products", getCategories);
products_router.post("/products", addCategories);
products_router.patch("/products", getCategories);
products_router.delete("/products/:categoryId", deleteCategory);
products_router.post("/products/:categoryId/subcategories", addSubcategoryById);
products_router.delete(
  "/products/:categoryId/subcategories/:subcategoryId",
  deleteSubcategory
);
products_router.patch(
  "/products/:categoryId/subcategories/:subcategoryId",
  updateSubcategory
);

module.exports = products_router;
