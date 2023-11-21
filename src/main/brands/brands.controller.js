const Brands = require("./brands.model");
const Category = require("../categories/categories.model");
const Products = require("../products/products.model");

const brandsController = {
  createBrand: async (req, res) => {
    try {
      const brand = new Brands(req.body);
      await brand.save();
      res.status(200).json({ message: "Brand created successfully", brand });
    } catch (error) {
      if (error.message === "Brand already registered") {
        return res.status(409).json({ message: "Brand already registered" });
      }
      res.status(500).json({ message: "Error creating brand", error });
    }
  },
  // getAllBrands: async (req, res) => {
  //   try {
  //     const page = parseInt(req.query.page, 10) || 1;
  //     const limit = parseInt(req.query.limit, 10) || 10;
  //     const skip = (page - 1) * limit;

  //     const brands = await Brands.find()
  //       .skip(skip)
  //       .limit(limit)
  //       .sort({ createdAt: -1 });
  //     const totalBrands = await Brands.countDocuments();
  //     const total_page = Math.ceil(totalBrands / limit);

  //     res.status(200).json({
  //       status: 200,
  //       meta: {
  //         total_brands: totalBrands,
  //         total_page: total_page,
  //         current_page: page,
  //         per_page: limit,
  //       },
  //       data: brands,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: "Error fetching brands", error });
  //   }
  // },

  getAllBrands: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const brandSlug = req.query.brand_slug;

      let query = {};
      if (brandSlug) {
        query.brand_slug = brandSlug;
      }
      const brands = await Brands.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const totalBrands = await Brands.countDocuments();

      const productCounts = await Products.aggregate([
        {
          $group: {
            _id: "$brand_id",
            count: { $sum: 1 },
          },
        },
      ]);
      const categoryCounts = await Category.aggregate([
        {
          $group: {
            _id: "$brand_id",
            count: { $sum: 1 },
          },
        },
      ]);

      const countMap = productCounts.reduce((map, item) => {
        map[item._id] = item.count;
        return map;
      }, {});

      const countMapCat = categoryCounts.reduce((map, item) => {
        map[item._id] = item.count;
        return map;
      }, {});

      const finalProducts = brands.map((brand) => {
        return {
          ...brand.toObject(),
          productCount: countMap[brand._id] || 0,
          categoryCount: countMapCat[brand._id] || 0,
        };
      });

      const total_page = Math.ceil(totalBrands / limit);

      res.status(200).json({
        status: 200,
        meta: {
          total_brands: totalBrands,
          total_page: total_page,
          current_page: page,
          per_page: limit,
        },
        data: finalProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching brands", error });
    }
  },
  getAllBrandsSearch: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
      const brandName = req.query.brandName || "";
      console.log(brandName);

      const searchCondition = brandName
        ? {
            brand_label: {
              $regex: new RegExp(brandName, "i"),
            },
          }
        : {};

      const brands = await Brands.find(searchCondition).skip(skip).limit(limit);
      const totalBrands = await Brands.countDocuments(searchCondition);
      const total_page = Math.ceil(totalBrands / limit);

      res.status(200).json({
        status: 200,
        meta: {
          total_brands: totalBrands,
          total_page: total_page,
          current_page: page,
          per_page: limit,
        },
        data: brands,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching brands", error });
    }
  },

  getAllBrandsIdandName: async (req, res) => {
    try {
      const brands = await Brands.find();
      const totalBrands = await Brands.countDocuments();
      const filter_brand = brands.map((each) => {
        return {
          id: each._id,
          name: each.brand_label,
          slug: each.brand_slug,
        };
      });

      res.status(200).json({
        status: 200,
        meta: {
          total_brands: totalBrands,
        },
        data: filter_brand,
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
      const brandId = req.params.id;
      console.log(brandId);
      const brand = await Brands.findByIdAndDelete(brandId);
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      const categoryDeletionResult = await Category.deleteMany({
        brand_id: brandId,
      });
      const productDeletionResult = await Products.deleteMany({
        brand_id: brandId,
      });

      res.status(200).json({
        message:
          "Brand and related categories and products deleted successfully",
        categoryDeletionResult,
        productDeletionResult,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting brand and related entities", error });
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
