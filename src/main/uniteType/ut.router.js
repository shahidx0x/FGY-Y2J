const express = require("express");
const unitRouter = express.Router();
const UnitType = require("./ut.model");

unitRouter.get("/unit-types", async (req, res) => {
  try {
    const unitTypes = await UnitType.find();
    res.status(200).json(unitTypes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching unit types" });
  }
});

unitRouter.post("/unit-types", async (req, res) => {
  const { label, value } = req.body;
  try {
    const newUnitType = new UnitType({ label, value });
    const savedUnitType = await newUnitType.save();
    res.status(200).json({message : 'Unit Created Successfully',status:200,data:savedUnitType});
  } catch (error) {
    if (error.message === "Unit already registered") {
      return res.status(409).json({ message: "Unit already registered" });
    }
    res.status(500).json({ message: "Error creating unit", error });
  }
});

unitRouter.patch("/unit-types/:id", async (req, res) => {
  const { label, value } = req.body;
  try {
    const updatedUnitType = await UnitType.findByIdAndUpdate(
      req.params.id,
      { label, value },
      { new: true }
    );
    res.status(200).json(updatedUnitType);
  } catch (error) {
    res.status(500).json({ error: "Error updating unit type" });
  }
});

unitRouter.delete("/unit-types/:id", async (req, res) => {
  try {
    const deletedUnitType = await UnitType.findByIdAndRemove(req.params.id);
    res.status(200).json(deletedUnitType);
  } catch (error) {
    res.status(500).json({ error: "Error deleting unit type" });
  }
});

module.exports = unitRouter;
