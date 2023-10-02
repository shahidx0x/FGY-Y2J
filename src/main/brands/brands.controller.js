const Brands = require("./brands.model");

const brandsController = {
  createBrand: async (req, res) => {
    try {
      const brand = new Brands(req.body);
      await brand.save();
      res
        .status(200)
        .json({ message: "Brand created successfully", status: 200, brand });
    } catch (error) {
      res.status(500).json({ message: "Error creating brand", error });
    }
  },

  getAllBrands: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const brands = await Brands.find().skip(skip).limit(limit);
      const totalBrands = await Brands.countDocuments();

      res.status(200).json({
        status: 200,
        total_brands: totalBrands,
        current_page: page,
        per_page: limit,
        brands,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching brands", error });
    }
  },

  getBrandById: async (req, res) => {
    try {
      const brand = await Brands.findById(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json(brand);
    } catch (error) {
      res.status(500).json({ message: "Error fetching brand", error });
    }
  },

  deleteBrandById: async (req, res) => {
    try {
      const brand = await Brands.findByIdAndDelete(req.params.id);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting brand", error });
    }
  },

  updateBrandById: async (req, res) => {
    try {
      const updatedBrand = await Brands.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedBrand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({
        message: "Brand updated successfully",
        status: 200,
        brand: updatedBrand,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating brand", error });
    }
  },
};

module.exports = brandsController;
