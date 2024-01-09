const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const Brands = require("../brands/brands.model");
const { default: slugify } = require("slugify");
const ObjectId = require("mongodb").ObjectId;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

exports.import_companys = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Upload error", error: err.message });
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const originalFileName = req.file.originalname;
    const filePath = path.join(__dirname, "uploads", originalFileName);

    try {
      fs.writeFileSync(filePath, req.file.buffer);
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      const filteredJson = jsonData.map((item) => {
        const { brand_slug, ...rest } = item;
        return rest;
      });
      const toBeInserted = filteredJson.filter((item) => ({
        brand_label: item.brand_label,
        brand_email: item.brand_email || "no email",
        brand_address: item.brand_address || "no address",
        brand_image: item.brand_image || "no image",
        brand_description: item.brand_description || "no desciption",
      }));
      const toBeInsertedWithSlug = toBeInserted.map((data) => ({
        ...data,
        brand_slug: slugify(data.brand_label, { lower: true, strict: true }),
        _id: new ObjectId(),
      }));
        
      const uniqueBrandSlugs = Array.from(
        new Set(toBeInsertedWithSlug.map((data) => data.brand_slug))
      );
      if (toBeInsertedWithSlug.length !== uniqueBrandSlugs.length) {
        res
          .status(400)
          .json({ message: "Duplicate data detected in xl sheet" });
        return;
      }
      try {
        await Brands.insertMany(toBeInsertedWithSlug);
        res.status(200).json({ message: "Data imported successfully" });
      } catch (error) {
        console.log(error);
        if (error.code === 11000) {
          res.status(400).json({
            message:
              "Duplicate data detected . Ensure that data alrady not in the database .",
            error,
          });
        } else {
          console.error("Error processing file:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      }
    } catch (writeErr) {
      console.log(writeErr);
      res
        .status(500)
        .json({ message: "Error saving file", error: writeErr.message });
    }
  });
};
