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
  booked: Number,
  ongoing: Number,
  available: Number,
  stock: Number,
});

const productSchema = new mongoose.Schema({
  name: String,
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
