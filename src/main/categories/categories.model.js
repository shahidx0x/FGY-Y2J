const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    brand_id: {
      type: String,
      required: true,
    },
    category_id: {
      type: String,
      required: true,
    },
    subcategory_name: {
      type: String,
      required: true,
    },
    image: String,
    slug: {
      type: String,
      required: true,
    },
    description: String,
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {    category_label: {
      type: String,
      required: true,
    },
    category_type: {
      type: String,
      required: true,
    },
    image: String,
    brand_id: String,
    subCategories: [subCategorySchema],
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
