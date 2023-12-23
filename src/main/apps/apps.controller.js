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
  

  exports.getAppSettingsById = async (req, res) => {
    try {
      const appSettings = await AppSettings.findById(req.params.id);
      if (!appSettings) {
        return res.status(404).json({ error: 'AppSettings not found' });
      }
      res.status(200).json(appSettings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.updateAppSettings = async (req, res) => {
  console.log(req.params.id);
    try {
      const updatedAppSettings = await AppSettings.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedAppSettings) {
        return res.status(404).json({ error: 'AppSettings not found' });
      }
      return res.status(200).json({ message: 'settings updated' });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.deleteAppSettings = async (req, res) => {
    try {
      const deletedAppSettings = await AppSettings.findByIdAndDelete(req.params.id);
      if (!deletedAppSettings) {
        return res.status(404).json({ error: 'AppSettings not found' });
      }
      res.status(200).json(deletedAppSettings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };