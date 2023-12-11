const Products = require("./products.model");
const mongoose = require("mongoose");

const ProductsController = {
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const brandSlug = req.query.brand_slug;
      const catSlug = req.query.cat_slug;
      const subCatSlug = req.query.subcat_slug;
      const categoryName = req.query.category_name;
      const boxParam = req.query.box === "true";
      const piecesParam = req.query.pieces === "true";
      const subCategoryName = req.query.sub_category_name
        ? req.query.sub_category_name.trim()
        : null;
      const disable = req.query.disable;

      let query = {};
      if (req.query.product_id) {
        query._id = req.query.product_id;
      }
      if (brandSlug) {
        query.brand_slug = brandSlug;
      }

      if (catSlug) {
        query.category_slug = catSlug;
      }
      if (subCatSlug) {
        query.subcategory_slug = subCatSlug;
      }
      if (categoryName) {
        query.category_name = new RegExp(categoryName, "i");
      }
      if (subCategoryName) {
        query.subcategory_name = new RegExp(subCategoryName, "i");
      }
      if (search) {
        query.name = new RegExp(search, "i");
      }

      if (disable === "true") {
        query.isDisable = true;
      } else if (disable === "false") {
        query.isDisable = false;
      }

      const unitFlag = parseInt(req.query.unit_flag, 10);
      if (unitFlag === 0 || unitFlag === 1) {
        query.unit_flag = unitFlag;
      }

      if (boxParam && piecesParam) {
      } else if (boxParam) {
        query.unit_flag = 0;
      } else if (piecesParam) {
        query.unit_flag = 1;
      }

      const totalProducts = await Products.countDocuments(query);

      let products;
      if (limit === -1) {
        products = await Products.find(query).sort({ createdAt: -1 });
        limit = totalProducts;
      } else {
        products = await Products.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
      }

      if (products) {
        products = products.map((product) => {
          product.afterDiscount =
            product.discount > 0
              ? product.price - (product.price * product.discount) / 100
              : product.price;
          return product;
        });
      }

      const totalPages = Math.ceil(totalProducts / (limit === 0 ? 1 : limit));

      return res.status(200).json({
        status: 200,
        meta: {
          current_page: page,
          per_page: limit,
          total_pages: totalPages,
          total_products: totalProducts,
        },
        data: products,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, error: "Could not fetch products" });
    }
  },

  getAllProductsByBrandId: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const brand_id = req.query.brand_id;

      let filter = {};
      if (brand_id) {
        filter.brand_id = brand_id;
      }

      const products = await Products.find(filter).skip(skip).limit(limit);
      const totalProducts = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);

      return res.status(200).json({
        status: 200,
        meta: {
          current_page: page,
          per_page: limit,
          total_pages: totalPages,
          total_products: totalProducts,
        },
        data: products,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, error: "Could not fetch products" });
    }
  },

  createProduct: async (req, res) => {
    try {
      const product = new Products(req.body);
      await product.save();
      res
        .status(201)
        .json({ message: "Product Created Successfully", product });
    } catch (error) {
      if (error.message === "Product already registered") {
        return res.status(409).json({ message: "Product already registered" });
      }
      res.status(500).json({ message: "Error creating Product", error });
    }
  },

  updateProducts: async (req, res) => {
    try {
      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  },
  updateFetImage: async (req, res) => {
    const { productId } = req.params;
    const { imageUrl } = req.query;

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "not found" });
    }
    if (imageUrl) {
      product.fet_image = product.fet_image.filter(
        (image) => image !== imageUrl
      );
    }
    await product.save();
    res.status(200).json({ message: "image deleted" });

    res.json(product);
  },

  deleteProducts: async (req, res) => {
    try {
      const deletedProduct = await Products.findByIdAndDelete(req.params.id);
      if (!deletedProduct)
        return res.status(404).json({ message: "Product not found" });
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  },
  updateVarient: async (req, res) => {
    try {
      const productId = req.params.productId;
      const { varientId, varientData } = req.body;
      console.log(productId, varientId, varientData);
      if (varientId) {
        await Products.updateOne(
          { _id: productId, "varient._id": varientId },
          { $set: { "varient.$": varientData } }
        );
      } else {
        await Products.updateOne(
          { _id: productId },
          { $push: { varient: varientData } }
        );
      }

      res.status(200).json({ message: "Varient updated/added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating/adding varient", error });
    }
  },

  updateSKU: async (req, res) => {
    const productId = req.params.productId;
    const { booked, ongoing, available, stock } = req.body;

    try {
      const product = await Products.findById(productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (
        booked !== undefined ||
        ongoing !== undefined ||
        available !== undefined ||
        stock !== undefined
      ) {
        const sku = product.sku[0];

        if (booked !== undefined) {
          sku.booked = booked;
        }

        if (ongoing !== undefined) {
          sku.ongoing = ongoing;
        }

        if (available !== undefined) {
          sku.available = available;
        }

        if (stock !== undefined) {
          sku.stock = stock;
        }

        await product.save();
      }

      res.json({ message: "SKU information updated successfully", product });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error updating SKU information", error });
    }
  },

  deleteVarient: async (req, res) => {
    try {
      const { productId, varientId } = req.body;

      await Products.updateOne(
        { _id: productId },
        { $pull: { varient: { _id: varientId } } }
      );

      res.status(200).json({ message: "Varient deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting varient", error });
    }
  },

  deleteSKU: async (req, res) => {
    try {
      const { productId, skuId } = req.body;

      const resp = await Products.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { $pull: { sku: { _id: new mongoose.Types.ObjectId(skuId) } } }
      );

      if (resp.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (resp.modifiedCount === 0) {
        return res
          .status(404)
          .json({ message: "SKU not found or already removed" });
      }

      res.status(200).json({ message: "SKU deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting SKU", error });
    }
  },
  update_sku: async (req, res) => {
    const { productId } = req.params;
    const { ongoing_inc, ongoing_dec, booked_inc, booked_dec } = req.query;

    try {
      const product = await Products.findById(productId);

      if (!product || product.sku.length === 0) {
        return res.status(404).json({ message: "Product or SKU not found" });
      }

      const sku = product.sku[0];

      if (ongoing_inc) {
        const increment = parseInt(ongoing_inc, 10);
        if (sku.ongoing + increment <= sku.stock) {
          sku.ongoing += increment;
        } else {
          return res.status(400).json({ message: "Exceeds stock limit" });
        }
      }

      if (ongoing_dec) {
        const decrement = parseInt(ongoing_dec, 10);
        if (sku.ongoing - decrement >= 0) {
          sku.ongoing -= decrement;
        } else {
          return res.status(400).json({ message: "Cannot go below zero" });
        }
      }

      if (booked_inc) {
        const increment = parseInt(booked_inc, 10);
        if (sku.booked + increment <= sku.stock) {
          sku.booked += increment;
        } else {
          return res.status(400).json({ message: "Exceeds stock limit" });
        }
      }

      if (booked_dec) {
        const decrement = parseInt(booked_dec, 10);
        if (sku.booked - decrement >= 0) {
          sku.booked -= decrement;
        } else {
          return res.status(400).json({ message: "Cannot go below zero" });
        }
      }

      if (sku.ongoing === sku.stock) {
        product.isDisable = true;
      } else {
        product.isDisable = false;
      }

      await product.save();

      res.status(200).json({ message: "SKU updated successfully", product });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating SKU", error: error.message });
    }
  },
};

module.exports = ProductsController;
