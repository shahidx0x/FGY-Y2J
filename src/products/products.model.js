const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryName: String,
  subCategoryImage: String,
  subCategoryPrice: Number,
});

const categorySchema = new mongoose.Schema({
  categoryName: String,
  brandName: String,
  categoryImage: String,
  subCategory: [subCategorySchema],
});

const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = { Category, SubCategory };
