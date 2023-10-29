const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Category",
  new mongoose.Schema(
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
      isActive: Boolean,
      image: String,
      brand_id: String,
      brand_name: String,
      subCategories: [
        new mongoose.Schema(
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
        ),
      ],
    },
    { timestamps: true }
  )
);
