const logger = require("../../configs/logger");
const { Category } = require("./products.model");
const ObjectId = require("mongodb").ObjectId;

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories.length === 0)
      return res
        .status(404)
        .json({ message: "no category in the database", status: 404 });
    return res
      .status(200)
      .json({ status: 200, totalCategories: categories.length, categories });
  } catch (error) {
    logger.info(error);
    return res
      .status(500)
      .json({ message: "internal server error", status: 500 });
  }
};

exports.addCategories = async (req, res) => {
  try {
    const { categoryName, brandName, categoryImage } = req.body;
    const newCategory = new Category({
      categoryName,
      brandName,
      categoryImage,
      subCategory: [],
    });
    await newCategory.save();
    return res.status(200).json({
      message: "category added successfully",
      status: 200,
      category: newCategory,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "internal server error", status: 500 });
  }
};

exports.addSubcategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subCategoryName, subCategoryImage, subCategoryPrice } = req.body;
    const category = await Category.findById({ _id: new ObjectId(categoryId) });
    if (!category) {
      return res
        .status(404)
        .json({ message: "category not found", status: 404 });
    }
    const newSubcategory = {
      subCategoryName,
      subCategoryImage,
      subCategoryPrice,
    };
    category.subCategory.push(newSubcategory);
    const updatedCategory = await category.save();
    res.status(200).json({
      message: "subcategory added successfully",
      status: 200,
      category: updatedCategory,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

exports.deleteSubcategory = async (req, res) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const category = await Category.findById({ _id: new ObjectId(categoryId) });
    if (!category) {
      return res
        .status(404)
        .json({ message: "category not found", status: 404 });
    }
    const subcategoryIndex = category.subCategory.findIndex(
      (subcat) => subcat._id.toString() === subcategoryId
    );
    if (subcategoryIndex === -1) {
      return res
        .status(404)
        .json({ message: "subcategory not found", status: 404 });
    }
    category.subCategory.splice(subcategoryIndex, 1);
    await category.save();
    return res
      .status(200)
      .json({ message: "subcategory removed successfully", status: 200 });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ message: "internal server error", status: 500 });
  }
};
