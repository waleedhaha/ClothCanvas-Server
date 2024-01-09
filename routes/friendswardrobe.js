const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const FollowRequest = require("../routes/followRequest"); // adjust the path as necessary
const Wardrobe = require("../routes/userWardrobe"); // Assuming you have a Wardrobe model

const axios = require('axios');
const cors = require('cors');

router.use(cors());

require("dotenv").config();

// ... Other routes ...

// New endpoint to retrieve wardrobe data for friends
router.get("/getFriendsWardrobe/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user's friends who have accepted the friend request
    const friends = await FollowRequest.find({
      fromUser: userId,
      status: "accepted",
    });

    // Extract the friend IDs from the friends array
    const friendIds = friends.map((friend) => friend.toUser);

    // Retrieve wardrobe data for the user's friends
    const wardrobeData = await Wardrobe.find({ userId: { $in: friendIds } });

    console.log("Friends:", friends);
    console.log("Friend IDs:", friendIds);
    console.log("Wardrobe Data:", wardrobeData);

    res.status(200).json({ data: wardrobeData, success: true });
  } catch (error) {
    console.error("Error fetching wardrobe data:", error);
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
