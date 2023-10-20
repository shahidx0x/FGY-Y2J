const express = require("express");
const products_router = express.Router();
const ProductsController = require("./products.controller");

products_router.get("/get/all/products", ProductsController.getAllProducts);
products_router.get(
  "/get/all/products/by/brand",
  ProductsController.getAllProductsByBrandId
);
products_router.post("/create/products", ProductsController.createProducts);
products_router.patch(
  "/update/products/:id",
  ProductsController.updateProducts
);
products_router.delete(
  "/delete/products/:id",
  ProductsController.deleteProducts
);

module.exports = products_router;
