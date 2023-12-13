const mongoose = require("mongoose");
const slugify = require("slugify");

const unitTypeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  slug: String,
});
unitTypeSchema.pre("save", async function (next) {
  if (this.isModified("label")) {
    const baseSlug = slugify(this.label, { lower: true, strict: true });
    this.slug = baseSlug;

    const existing = await UnitType.findOne({ slug: this.slug });
    if (existing) {
      throw new Error("Unit already registered");
    }
  }
  next();
});
const UnitType = mongoose.model("UnitType", unitTypeSchema);

module.exports = UnitType;
