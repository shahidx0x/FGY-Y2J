const express = require("express");
const products_router = express.Router();
const ProductsController = require("./products.controller");

products_router.get("/get/all/products", ProductsController.getAllProducts);
products_router.get(
  "/get/all/products/by/brand",
  ProductsController.getAllProductsByBrandId
);
products_router.post("/create/products", ProductsController.createProduct);
products_router.patch(
  "/update/products/:id",
  ProductsController.updateProducts
);
products_router.delete(
  "/delete/products/:id",
  ProductsController.deleteProducts
);
products_router.post(
  "/create/varient/in/product/:productId",
  ProductsController.updateVarient
);
products_router.post(
  "/create/sku/in/product/:productId",
  ProductsController.updateSKU
);
products_router.delete(
  "/products/:productId/varient/:varientId",
  ProductsController.deleteVarient
);
products_router.delete(
  "/products/:productId/sku/:skuId",
  ProductsController.deleteSKU
);

module.exports = products_router;
