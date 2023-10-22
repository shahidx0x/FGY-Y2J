const mongoose = require("mongoose");

const varientSchema = new mongoose.Schema({
  name: String,
  des: String,
  image: String,
  price: Number,
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
  subcategory_ids: [],
  product_image: String,
  fet_image: [
    new mongoose.Schema({
      fet_img_one: String,
      fet_img_two: String,
      fet_img_three: String,
      fet_img_four: String,
    }),
  ],
  min_purchease: Number,
  max_purchease: Number,
  price: Number,
  varient: [varientSchema],
  sku: [skuSchema],
});

module.exports = mongoose.model("Products", productSchema);
