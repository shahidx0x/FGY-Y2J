const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");
const config = require("../../../configs/config");
const Brands = require("../brands/brands.model");
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
    console.log(filePath);

    try {
      fs.writeFileSync(filePath, req.file.buffer);
      const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      console.log(jsonData);
      try {
        await Brands.insertMany(
          jsonData.map((data) => ({ ...data, _id: new ObjectId() }))
        );
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

      const fileUrl = `${config.domain}/uploads/${originalFileName}`;
      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl,
      });
    } catch (writeErr) {
      console.log(writeErr);
      res
        .status(500)
        .json({ message: "Error saving file", error: writeErr.message });
    }
  });
};
