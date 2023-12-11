const mongoose = require("mongoose");
const slugify = require("slugify");

const brandSchema = new mongoose.Schema({
  brand_label: {
    type: String,
    required: true,
    trim: true,
  },
  brand_slug: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
  },
  brand_description: String,
  brand_email: String,
  brand_address: String,
  created_by: String,
  brand_image: {
    type: String,
    default:
      "https://www.rallis.com/Upload/Images/thumbnail/Product-inside.png",
  },
});
brandSchema.pre("save", async function (next) {
  if (this.isModified("brand_label")) {
    const baseSlug = slugify(this.brand_label, { lower: true, strict: true });
    this.brand_slug = baseSlug;

    const existingBrand = await Brands.findOne({ brand_slug: this.brand_slug });
    if (existingBrand) {
      throw new Error("Brand already registered");
    }
  }
  next();
});

const Brands = mongoose.model("Brands", brandSchema);

module.exports = Brands;
