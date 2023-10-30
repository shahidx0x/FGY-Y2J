const Category = require("../categories.model");

const SubCategoryController = {
  getAllSubCategories: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const page = parseInt(req.query.page, 10) || 1;
      let limit = parseInt(req.query.limit, 10) || 10;

      const category = await Category.findById(categoryId);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      let paginatedSubCategories;
      let totalPages;

      if (limit === -1) {
        paginatedSubCategories = category.subCategories;
        totalPages = 1;
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        paginatedSubCategories = category.subCategories.slice(
          startIndex,
          endIndex
        );
        totalPages = Math.ceil(category.subCategories.length / limit);
      }

      res.status(200).json({
        meta: {
          total_subcategories: category.subCategories.length,
          total_page: totalPages,
          current_page: page,
          per_page: limit,
        },
        data: paginatedSubCategories,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getSubCategoryById: async (req, res) => {
    try {
      const { categoryId, subCategoryId } = req.params;
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      res.status(200).json({ subCategory });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addSubCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const subCategoryData = req.body;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      category.subCategories.push(subCategoryData);
      await category.save();

      res.status(201).json({
        message: "Subcategory added successfully",
        subCategory: subCategoryData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateSubCategory: async (req, res) => {
    try {
      const { categoryId, subCategoryId } = req.params;
      const subCategoryData = req.body;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      const subCategory = category.subCategories.id(subCategoryId);
      if (!subCategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      Object.assign(subCategory, subCategoryData);
      await category.save();

      res
        .status(200)
        .json({ message: "Subcategory updated successfully", subCategory });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteSubCategory: async (req, res) => {
    try {
      const { categoryId, subCategoryId } = req.params;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      category.subCategories.id(subCategoryId).remove();
      await category.save();

      res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SubCategoryController;
