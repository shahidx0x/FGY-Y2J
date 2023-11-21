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
      "https://www.ivins.com/wp-content/uploads/2020/09/placeholder-1.png",
  },
});

brandSchema.pre("save", async function (next) {
  if (this.isModified("brand_label")) {
    const baseSlug = slugify(this.brand_label, { lower: true, strict: true });
    this.brand_slug = baseSlug;

    let counter = 1;
    while (true) {
      try {
        const existingBrand = await Brand.findOne({
          brand_slug: this.brand_slug,
        });
        if (!existingBrand) {
          break;
        }
        this.brand_slug = `${baseSlug}-${counter}`;
        counter++;
      } catch (err) {
        return next(err);
      }
    }
  }
  next();
});

module.exports = mongoose.model("Brands", brandSchema);
