const path = require("path");
const Brands = require("../brands/brands.model");
const Category = require("../categories/categories.model");
const Products = require("../products/products.model");
const excel = require("exceljs");
const { ObjectId } = require("mongodb");

module.exports = export_controller = {
  export_brands: async (req, res) => {
    try {
      const brands = await Brands.find({}).sort({ createdAt: -1 });
      const data = brands.map((brand) => brand.toObject());
      if (brands.length === 0) {
        res.status(404).json({ message: "No data to export" });
      }
      const workbook = new excel.Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");
      const headers = Object.keys(data[0]).filter(
        (key) =>
          !key.startsWith("$") &&
          !key.startsWith("_") &&
          !key.startsWith("brand_slug")
      );
      worksheet.addRow(headers);

      const xldataOrder = data.map((item) => ({
        brand_label: item.brand_label,
        brand_email: item.brand_email || "",
        brand_address: item.brand_address || "",
        brand_image: item.brand_image || "",
        brand_description: item.brand_description || "",
      }));

      xldataOrder.forEach((row) => {
        const values = Object.values(row);
        worksheet.addRow(values);
      });
      const fileName = "exported_companys.xlsx";

      const filePath = path.join(__dirname, fileName);
      await workbook.xlsx.writeFile(filePath);
      res.attachment(fileName);
      res.sendFile(fileName, { root: __dirname });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
