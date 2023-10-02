const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
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
    trim: true,
  },
});

const Brands = mongoose.model("Brands", brandSchema);
module.exports = Brands;
