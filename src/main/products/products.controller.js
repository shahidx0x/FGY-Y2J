const Products = require("./products.model");

const ProductsController = {
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const brandId = req.query.brand_id || req.params.brand_id;
      const productId = req.query.product_id;
      let query = {};
      if (productId) {
        query = { _id: productId };
      } else if (brandId) {
        query = { brand_id: brandId };
      }
      const totalProducts = await Products.countDocuments(query);

      let products;
      if (limit === -1) {
        products = await Products.find(query);
        limit = totalProducts;
      } else {
        products = await Products.find(query).skip(skip).limit(limit);
      }

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
      res.status(500).json({ message: "Error creating product", error });
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
    try {
      const productId = req.params.productId;
      const { skuId, skuData } = req.body;

      if (skuId) {
        await Products.updateOne(
          { _id: productId, "sku._id": skuId },
          { $set: { "sku.$": skuData } }
        );
      } else {
        await Products.updateOne(
          { _id: productId },
          { $push: { sku: skuData } }
        );
      }

      res.status(200).json({ message: "SKU updated/added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating/adding SKU", error });
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

      await Products.updateOne(
        { _id: productId },
        { $pull: { sku: { _id: skuId } } }
      );

      res.status(200).json({ message: "SKU deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting SKU", error });
    }
  },
};

module.exports = ProductsController;
