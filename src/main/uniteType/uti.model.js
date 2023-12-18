const slugify = require("slugify");
const mongoose = require("mongoose");


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
  
const Units = mongoose.model("Units", unitsSchema);
module.exports = Units;