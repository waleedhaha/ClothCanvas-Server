const express = require("express");
const router = express.Router();

const UserWardrobe = require("../models/UserWardrobe"); // Import the model

router.post("/", async (req, res) => {
  try {
    const userWardrobe = new UserWardrobe(req.body);
    await userWardrobe.save();
    res.status(201).send(userWardrobe);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const categoryId = req.query.categoryId; // Get categoryId from query parameters

        let filter = { userId: userId };

        if (categoryId) {
            filter.categoryId = categoryId;
        }

      const item = await UserWardrobe.find(filter).populate('userId').populate('categoryId').populate('subCategoryId');
      res.status(200).json({success: true, data: item});
    } catch (error) {
      res.status(500).send(error);
    }
});

module.exports = router;
