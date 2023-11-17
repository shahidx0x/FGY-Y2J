const mongoose = require("mongoose");

const varientSchema = new mongoose.Schema({
  name: String,
  base_price: Number,
  discount: Number,
  des: String,
  image: String,
  price: Number,
  min_puchease: Number,
  max_purchease: Number,
});

const skuSchema = new mongoose.Schema({
  var_id: String,
  booked: { type: Number, default: 0 },
  ongoing: { type: Number, default: 0 },
  available: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: String,
  isDisable: {
    type: Boolean,
    default: false,
  },
  description: String,
  brand_id: String,
  brand_name: String,
  category_id: String,
  category_name: String,
  subcategory_id: String,
  subcategory_name: String,
  product_image: String,
  discount: Number,
  base_price: Number,
  fet_image: [],
  min_purchease: Number,
  max_purchease: Number,
  price: Number,
  product_information: String,
  varient: [varientSchema],
  sku: [skuSchema],
});

module.exports = mongoose.model("Products", productSchema);
