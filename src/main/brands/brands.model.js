const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Brands",
  new mongoose.Schema({
    brand_label: {
      type: String,
      required: true,
      trim: true,
    },
    brand_slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    brand_image: {
      type: String,
      default:
        "https://www.ivins.com/wp-content/uploads/2020/09/placeholder-1.png",
    },
  })
);
