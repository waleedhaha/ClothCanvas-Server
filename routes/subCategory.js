const express = require("express");
const router = express.Router();

const SubCategory = require("../models/SubCategory"); // Import the model

router.post("/", async (req, res) => {
    try {
        const category = new SubCategory(req.body);
        await category.save();
        res.status(201).send(category);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/", async (req, res) => {
  try {
    const categories = await SubCategory.find({});
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await SubCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/fetchByCategory/:categoryId", async (req, res) => {
  try {
    const category = await SubCategory.find({
      categoryId: req.params.categoryId,
    });
    res.status(200).json({success: true, data:category});
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE a category by ID
router.patch("/:id", async (req, res) => {
  try {
    const category = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await SubCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).send();
    }
    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
