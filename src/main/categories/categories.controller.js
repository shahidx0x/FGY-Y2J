const Category = require("./categories.model");
const Products = require("../products/products.model");

const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const newCategory = new Category(req.body);
      await newCategory.save();
      res
        .status(201)
        .json({ message: "Category created successfully", data: newCategory });
    } catch (error) {
      if (error.message === "Category already registered") {
        return res.status(409).json({ message: "Category already registered" });
      }
      res.status(500).json({ message: "Error creating Category", error });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const search = req.query.search || "";
      const brandName = req.query.brand_name;
      const brandId = req.query.brand_id;

      let query = {};
      if (brandName) {
        query.brand_name = brandName;
      }
      if (brandId) {
        query.brand_id = brandId;
      }
      if (search) {
        query.category_label = new RegExp(search, "i");
      }

      const totalCategory = await Category.countDocuments(query);
      let categories;
      if (limit === -1) {
        categories = await Category.find(query).sort({ createdAt: -1 });
      } else {
        categories = await Category.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });
      }

      const productCounts = await Products.aggregate([
        {
          $group: {
            _id: "$category_id",
            count: { $sum: 1 },
          },
        },
      ]);

      const countMap = productCounts.reduce((map, item) => {
        map[item._id.toString()] = item.count;
        return map;
      }, {});

      const categoryWithProductCount = categories.map((category) => {
        return {
          ...category.toObject(),
          productCount: countMap[category._id.toString()] || 0,
        };
      });

      const total_page = limit === -1 ? 1 : Math.ceil(totalCategory / limit);

      res.status(200).json({
        status: 200,
        meta: {
          total_categories: totalCategory,
          total_page: total_page,
          current_page: page,
          per_page: limit === -1 ? totalCategory : limit,
        },
        data: categoryWithProductCount,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching categories", error: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const categoryId = req.params.id;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ data: category });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching category", error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.query.id || req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({
        message: "Category updated successfully",
        status: 200,
        brand: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating category", error });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      await Products.deleteMany({ category_id: categoryId });

      res.status(200).json({
        message: "Category and related products deleted successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    }
  },
};

module.exports = CategoryController;
