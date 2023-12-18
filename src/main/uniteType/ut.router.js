const express = require("express");
const unitRouter = express.Router();
const UnitType = require("./ut.model");
const Units = require("./uti.model");

unitRouter.get("/unit-types", async (req, res) => {
  try {
    const unitTypes = await UnitType.find();
    res.status(200).json(unitTypes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching unit types" });
  }
});

unitRouter.get("/units", async (req, res) => {
  try {
    const units = await Units.find();
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ error: "Error fetching units" });
  }
});

unitRouter.post("/unit-types", async (req, res) => {
  try {
    const newUnitType = new UnitType(req.body);
    const savedUnitType = await newUnitType.save();
    res.status(200).json({
      message: "Unit Created Successfully",
      status: 200,
      data: savedUnitType,
    });
  } catch (error) {
    console.log(error);
    if (error.message === "Unit type already exist") {
      return res.status(409).json({ message: "Unit type already exist" });
    }
    res.status(500).json({ message: "Error creating unit type", error });
  }
});

unitRouter.post("/units", async (req, res) => {
  try {
    const newUnit = new Units(req.body);
    const savedUnit = await newUnit.save();
    res.status(200).json({
      message: "Unit Created Successfully",
      status: 200,
      data: savedUnit,
    });
  } catch (error) {
    console.log(error);
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
      updatedUnitType = await UnitType.findOne({ label: req.query.unit_type });
   
      if (updatedUnitType) {
        updatedUnitType.quantity = req.query.unit_value;
        await updatedUnitType.save();
       
      }
    }
    if (req.query.id) {
      updatedUnitType = await UnitType.findByIdAndUpdate(
        req.query.id,
        req.body,
        { new: true }
      );
    }

    res.status(200).json(updatedUnitType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating unit type" ,error});
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

unitRouter.delete("/units/:id", async (req, res) => {
  try {
    const deletedUnitType = await Units.findByIdAndRemove(req.params.id);
    res.status(200).json(deletedUnitType);
  } catch (error) {
    res.status(500).json({ error: "Error deleting unit type" });
  }
});

module.exports = unitRouter;
