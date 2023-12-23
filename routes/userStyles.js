const express = require("express");
const router = express.Router();

const UserStyles = require("../models/UserStyles"); // adjust the path as necessary

router.post("/", async (req, res) => {
  const { userId, name, favoriteColors, favoriteClothes } = req.body;

  const userStyles = new UserStyles({
    userId,
    name,
    favoriteColors,
    favoriteClothes,
  });

  try {
    await userStyles.save();
    res.status(201).json(userStyles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const preferences = await UserStyles.find({ userId: userId });
    res.json(preferences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
