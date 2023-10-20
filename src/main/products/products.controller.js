const Products = require("./products.model");

const ProductsController = {
  getAllProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const products = await Products.find().skip(skip).limit(limit);
      const totalProducts = await Products.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      const transformedProducts = products.map((product) => {
        return {
          id: product._id,
          name: product.name,
          des: product.des,
          brand_id: product.brand_id,
          category_id: product.category_id,
          subcategory_ids: product.subcategory_ids,
          product_image: product.product_image,
          fet_image: product.fet_image,
          min_purchease: product.min_purchease,
          max_purchease: product.max_purchease,

          sku: {
            booked: product.sku_booked,
            ongoing: product.sku_ongoing,
            available: product.sku_available,
            stock: product.sku_stock,
          },
          varient: {
            name: product.var_name,
            des: product.var_des,
            image: product.var_image,
          },
        };
      });

      return res.status(200).json({
        status: 200,
        meta: {
          current_page: page,
          per_page: limit,
          total_pages: totalPages,
          total_products: totalProducts,
        },
        data: transformedProducts,
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

      const transformedProducts = products.map((product) => {
        return {
          id: product._id,
          name: product.name,
          des: product.des,
          brand_id: product.brand_id,
          category_id: product.category_id,
          subcategory_ids: product.subcategory_ids,
          product_image: product.product_image,
          fet_image: product.fet_image,
          min_purchease: product.min_purchease,
          max_purchease: product.max_purchease,

          sku: {
            booked: product.sku_booked,
            ongoing: product.sku_ongoing,
            available: product.sku_available,
            stock: product.sku_stock,
          },
          varient: {
            name: product.var_name,
            des: product.var_des,
            image: product.var_image,
          },
        };
      });

      return res.status(200).json({
        status: 200,
        meta: {
          current_page: page,
          per_page: limit,
          total_pages: totalPages,
          total_products: totalProducts,
        },
        data: transformedProducts,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, error: "Could not fetch products" });
    }
  },

  createProducts: async (req, res) => {
    try {
      const newProduct = await Products.create(req.body);
      const {
        var_name,
        var_des,
        var_image,
        sku_booked,
        sku_ongoing,
        sku_available,
        sku_stock,
      } = newProduct;
      const data = {
        var: {
          name: var_name,
          des: var_des,
          image: var_image,
        },
        sku: {
          booked: sku_booked,
          ongoing: sku_ongoing,
          available: sku_available,
          stock: sku_stock,
        },
        id: newProduct._id,
        name: newProduct.name,
        des: newProduct.des,
        brand_id: newProduct.brand_id,
        category_id: newProduct.category_id,
        subcategory_ids: newProduct.subcategory_ids,
        product_image: newProduct.product_image,
        fet_image: newProduct.fet_image,
        min_purchease: newProduct.min_purchease,
        max_purchease: newProduct.max_purchease,
      };

      return res
        .status(201)
        .json({ message: "Product Created Successfully", data });
    } catch (error) {
      return res.status(500).json({ error: "Could not create a new product" });
    }
  },

  updateProducts: async (req, res) => {
    try {
      const updatedProduct = await Products.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        return res
          .status(404)
          .json({ status: 404, error: "Product not found" });
      }
      return res.json({
        status: 200,
        message: "Product info updated successfully",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, error: "Could not update the product" });
    }
  },

  deleteProducts: async (req, res) => {
    try {
      const deletedProduct = await Products.findByIdAndRemove(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.json({ status: 200, message: "Product Deleted Successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Could not delete the product" });
    }
  },
};

module.exports = ProductsController;
