const Products = require("./products.model");
const mongoose = require("mongoose");

const ProductsController = {
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";

      const brandName = req.query.brand_name;
      const categoryName = req.query.category_name;
      const subCategoryName = req.query.sub_category_name;

      let query = {};
      if (req.query.product_id) {
        query._id = req.query.product_id;
      }
      if (brandName) {
        query.brand_name = brandName;
      }
      if (categoryName) {
        query.category_name = categoryName;
      }
      if (subCategoryName) {
        query.subcategory_name = subCategoryName;
      }

      if (search) {
        query.name = new RegExp(search, "i");
      }

      const totalProducts = await Products.countDocuments(query);

      let products;
      if (limit === -1) {
        products = await Products.find(query);
        limit = totalProducts;
      } else {
        products = await Products.find(query).skip(skip).limit(limit);
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
      const { varient = [], sku = [], ...rest } = req.body;

      const product = new Products({
        varient: varient.length
          ? varient
          : [
              {
                base_price: 0,
                discount: 0,
                price: 0,
                min_purchease: 0,
                max_purchease: 0,
              },
            ],
        sku: sku.length
          ? sku
          : [{ booked: 0, ongoing: 0, available: 0, stock: 0 }],
        ...rest,
      });

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
};

module.exports = ProductsController;
