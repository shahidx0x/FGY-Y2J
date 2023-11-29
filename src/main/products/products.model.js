const mongoose = require("mongoose");
const slugify = require("slugify");

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

const productSchema = new mongoose.Schema(
  {
    name: String,
    isDisable: {
      type: Boolean,
      default: false,
    },
    product_slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    category_slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    subcategory_slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    brand_slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: String,
    brand_id: String,
    brand_name: String,
    category_id: String,
    category_name: String,
    subcategory_id: String,
    subcategory_name: String,
    product_image: String,
    discount: {
      type: Number,
      default : 0
    },
    base_price: Number,
    fet_image: [],
    min_purchease: {
      type: Number,
      default : 0
    },
    max_purchease: {
      type: Number,
      default : 0
    },
    price: Number,
    afterDiscount: Number,
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
  },
  { timestamps: true }
);
productSchema.pre("save", async function (next) {
  if (
    this.isModified("name") ||
    this.isModified("brand_slug") ||
    this.isModified("category_slug") ||
    this.isModified("subcategory_slug")
  ) {
    this.product_slug = slugify(
      `${this.brand_slug}_${this.category_slug}_${this.subcategory_slug}_${this.name}`,
      {
        lower: true,
        strict: true,
      }
    );

    const existingProduct = await this.constructor.findOne({
      product_slug: this.product_slug,
    });
    if (existingProduct) {
      throw new Error("Product already registered");
    }
  }

  if (this.isNew) {
    this.sku.forEach((sku) => {
      sku.ref_id = this._id.toString();
    });
  }

  next();
});
module.exports = mongoose.model("Products", productSchema);
