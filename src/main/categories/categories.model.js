const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Category",
  new mongoose.Schema(
    {
      category_label: {
        type: String,
        required: true,
      },
      category_type: {
        type: String,
        required: true,
      },
      isActive: Boolean,
      image: String,
      brand_id: String,
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
