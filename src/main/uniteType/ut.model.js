const mongoose = require("mongoose");
const slugify = require("slugify");

const unitsSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
  },
  slug: String,
});
const unitTypeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
  },
  slug: String,
});
unitTypeSchema.pre("save", async function (next) {
  if (this.isModified("label")) {
    const baseSlug = slugify(this.label, { lower: true, strict: true });
    this.slug = baseSlug;

    const existing = await UnitType.findOne({ slug: this.slug });
    if (existing) {
      throw new Error("Unit type already exist");
    }
  }
  next();
});
unitsSchema.pre("save", async function (next) {
  if (this.isModified("label") || this.isModified("quantity")) {
    const combinedString = `${this.label}-${this.quantity}`
    const baseSlug = slugify(combinedString, { lower: true, strict: true });
    this.slug = baseSlug;

    const existing = await Units.findOne({ slug: this.slug });
    if (existing) {
      throw new Error("Unit already exist");
    }
  }
  next();
});
const UnitType = mongoose.model("UnitType", unitTypeSchema);
const Units = mongoose.model("Units", unitsSchema);

module.exports = UnitType;
module.exports = Units;
