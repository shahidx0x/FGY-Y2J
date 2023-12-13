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
  try {
    const newUnitType = new UnitType(req.body);
    const savedUnitType = await newUnitType.save();
    res
      .status(200)
      .json({
        message: "Unit Created Successfully",
        status: 200,
        data: savedUnitType,
      });
  } catch (error) {
    if (error.message === "Unit already exist") {
      return res.status(409).json({ message: "Unit already exist" });
    }
    res.status(500).json({ message: "Error creating unit", error });
  }
});

unitRouter.patch("/unit-types", async (req, res) => {
  try {
    let updatedUnitType;
    if (req.query.unit_type) {
      const updatedUnitType = await UnitType.find({ label: req.query.unit_type });
      updatedUnitType.quantity = req.body.unit_value;
      await updatedUnitType.save();
      
    }
    if (req.query.id) {
        updatedUnitType = await UnitType.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
    }
 
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
