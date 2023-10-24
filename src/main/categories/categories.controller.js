const Category = require("./categories.model");

const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const { category_label, category_type, image, brand_id } = req.body;
      const newCategory = new Category({
        category_label,
        category_type,
        image,
        brand_id,
      });
      await newCategory.save();
      res
        .status(201)
        .json({ message: "Category created successfully", data: newCategory });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating category", error: error.message });
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const brandId = req.query.brand_id || req.params.brand_id;

      let query;
      if (brandId) {
        query = { brand_id: brandId };
      } else {
        query = {};
      }

      const totalCategory = await Category.countDocuments(query);

      let categories;
      if (limit === -1) {
        categories = await Category.find(query);
        limit = totalCategory;
      } else {
        categories = await Category.find(query).skip(skip).limit(limit);
      }

      const total_page = Math.ceil(totalCategory / limit);
      res.status(200).json({
        status: 200,
        meta: {
          total_categories: totalCategory,
          total_page: total_page,
          current_page: page,
          per_page: limit,
        },
        data: categories,
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
      const categoryId = req.params.id;
      const { category_label, category_type, image, brand_id } = req.body;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (category_label) category.category_label = category_label;
      if (category_type) category.category_type = category_type;
      if (image) category.image = image;
      if (brand_id) category.brand_id = brand_id;

      await category.save();

      res
        .status(200)
        .json({ message: "Category updated successfully", data: category });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating category", error: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;

      const category = await Category.findByIdAndDelete(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    }
  },
};

module.exports = CategoryController;
