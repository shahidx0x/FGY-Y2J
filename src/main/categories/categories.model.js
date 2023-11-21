const mongoose = require("mongoose");
const slugify = require("slugify");

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
    subcategory_slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: String,
  },
  { timestamps: true }
);

const categorySchema = new mongoose.Schema(
  {
    category_label: {
      type: String,
    },
    category_type: {
      type: String,
    },
    category_description: {
      type: String,
    },
    category_slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    isActive: Boolean,
    image: String,
    brand_id: String,
    brand_slug: String,
    brand_name: String,
    subCategories: [subCategorySchema],
  },
  { timestamps: true }
);

categorySchema.pre("save", async function (next) {
  const Category = this.model("Category");

  if (this.isModified("category_label") || this.isModified("brand_slug")) {
    this.category_slug = `${this.brand_slug}_${slugify(this.category_label, {
      lower: true,
      strict: true,
    })}`;
    const existingCategory = await Category.findOne({
      category_slug: this.category_slug,
    });
    if (existingCategory) {
      throw new Error("Category already registered");
    }
  }

  if (this.isModified("subCategories")) {
    for (let subCategory of this.subCategories) {
      if (subCategory.isModified("subcategory_name")) {
        subCategory.subcategory_slug = `${this.brand_slug}_${
          this.category_slug
        }_${slugify(subCategory.subcategory_name, {
          lower: true,
          strict: true,
        })}`;
        const existingSubCategory = await Category.findOne({
          "subCategories.subcategory_slug": subCategory.subcategory_slug,
        });
        if (existingSubCategory) {
          throw new Error("Subcategory already registered");
        }
      }
    }
  }

  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
