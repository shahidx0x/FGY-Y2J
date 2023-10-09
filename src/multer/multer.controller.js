const multer = require("multer");
const sharp = require("sharp");
const config = require("../../configs/config");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

exports.uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Upload error", error: err.message });
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const randomUID = uuidv4();
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${randomUID}${fileExtension}`;

    const outputPath = path.join(__dirname, "..", "..", "uploads", filename);

    try {
      await sharp(req.file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      const fileUrl = `${config.domain}/uploads/${filename}`;
      res.status(200).json({
        message: "File uploaded successfully",
        fileUrl,
      });
    } catch (sharpErr) {
      res
        .status(500)
        .json({ message: "Error processing image", error: sharpErr.message });
    }
  });
};
