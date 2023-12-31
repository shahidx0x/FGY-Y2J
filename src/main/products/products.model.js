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
      default: "no_category",
    },
    subcategory_slug: {
      type: String,
      lowercase: true,
      trim: true,
      default: "no_sub_category",
    },
    brand_slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    description: String,
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: "Brands" },
    brand_name: String,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    category_name: String,
    subcategory_id: String,
    subcategory_name: String,
    product_image: {
      type: String,
      default:
        "https://www.rallis.com/Upload/Images/thumbnail/Product-inside.png",
    },
    discount: {
      type: Number,
      default: 0,
    },
    base_price: Number,
    fet_image: [],
    min_purchease: {
      type: Number,
      default: 0,
    },
    max_purchease: {
      type: Number,
      default: 0,
    },
    product_unit_type: {
      type: String,
    },
    product_unit_quantity: {
      type: Number,
      default: 1,
    },
    unit_flag: {
      type: Number,
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
    if (
      this.category_slug === undefined ||
      this.subcategory_slug === undefined
    ) {
      this.category_slug = "no_category";
      this.subcategory_slug = "no_sub_category";
    }
    this.product_slug = `${this.brand_slug}-${this.category_slug}-${
      this.subcategory_slug
    }-${slugify(`${this.name}`, {
      lower: true,
      strict: true,
    })}`;

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
