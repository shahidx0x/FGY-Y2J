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
        (key) => !key.startsWith("$") && !key.startsWith("_")
      );
      worksheet.addRow(headers);

      data.forEach((row) => {
        const values = Object.values(row);
        values.splice(0, 1);
        values.splice(5, 1);
        worksheet.addRow(values);
      });
      const fileName = "exported_companys.xlsx";

      const filePath = path.join(__dirname, fileName);
      await workbook.xlsx.writeFile(filePath);

      res.sendFile(fileName, { root: __dirname });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
