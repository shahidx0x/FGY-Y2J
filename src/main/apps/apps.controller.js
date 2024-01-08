const AppSettings = require("./app.model");

exports.createAppSettings = async (req, res) => {
  try {
    const newAppSettings = new AppSettings(req.body);
    const savedAppSettings = await newAppSettings.save();
    res.status(201).json(savedAppSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAppSettings = async (req, res) => {
  try {
    const allAppSettings = await AppSettings.find();
    res.status(200).json(allAppSettings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateAppSettings = async (req, res) => {
  try {
    const updatedAppSettings = await AppSettings.updateOne({}, req.body);
    if (!updatedAppSettings) {
      return res.status(404).json({ error: "AppSettings not found" });
    }
    return res.status(200).json({ message: "settings updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

