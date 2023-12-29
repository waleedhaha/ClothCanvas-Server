const express = require("express");
const router = express.Router();

const UserPreferences = require("../models/UserPreferences"); // adjust the path as necessary
const User = require("../models/User"); // adjust the path as necessary


router.post("/", async (req, res) => {
  // get user_id from jwt token;
  // const userId = ""
  const {
    name,
    age,
    dob,
    height,
    occupation,
    weight,
    bodyType,
    skinTone,
    userId,
    setIsFilledUserFlag
  } = req.body;

  const userPreferences = new UserPreferences({
    name,
    age,
    dob,
    height,
    occupation,
    weight,
    bodyType,
    skinTone,
    userId,
  });

  try {
    await userPreferences.save();
    if(setIsFilledUserFlag){
     await User.findByIdAndUpdate(userId, { detailsFilled: true })
    }
    res.status(201).json(userPreferences);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const preferences = await UserPreferences.find({ userId });
    res.json(preferences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
