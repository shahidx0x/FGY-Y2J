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
  des: String,
  brand_id: String,
  category_id: String,
  discount: Number,
  base_price: Number,
  subcategory_ids: [],
  product_image: String,
  fet_image: [],
  min_purchease: Number,
  max_purchease: Number,
  price: Number,
  varient: [varientSchema],
  sku: [skuSchema],
});

module.exports = mongoose.model("Products", productSchema);
