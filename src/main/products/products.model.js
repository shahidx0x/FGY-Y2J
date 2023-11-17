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
  ref_id: String,
  booked: Number,
  ongoing: Number,
  available: Number,
  stock: Number,
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
  varient: {
    type: [varientSchema],
    default: [
      {
        base_price: 0,
        discount: 0,
        price: 0,
        min_purchease: 0,
        max_purchease: 0,
      },
    ],
  },
  sku: {
    type: [skuSchema],
    default: [
      {
        booked: 0,
        available: 0,
        ongoing: 0,
        stock: 0,
      },
    ],
  },
});
productSchema.pre("save", function (next) {
  const product = this;
  if (product.isNew) {
    product.sku.forEach((sku) => {
      sku.ref_id = product._id.toString();
    });
  }
  next();
});
module.exports = mongoose.model("Products", productSchema);
