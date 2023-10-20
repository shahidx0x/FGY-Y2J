const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Products",
  new mongoose.Schema({
    name: String,
    des: String,
    brand_id: String,
    category_id: String,
    subcategory_ids: [],
    product_image: String,
    fet_image: String,
    min_purchease: Number,
    max_purchease: Number,
    var_name: String,
    var_des: String,
    var_image: String,
    sku_booked: Number,
    sku_ongoing: Number,
    sku_available: Number,
    sku_stock: Number,
  })
);
