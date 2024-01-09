const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const FollowRequest = require("../models/FollowRequest"); // adjust the path as necessary
const UserWardrobe = require("../models/UserWardrobe");

require("dotenv").config();

router.post("/", async (req, res) => {
  const newFollowRequest = new FollowRequest({
    fromUser: req.body.fromUserId,
    toUser: req.body.toUserId,
    status: "pending",
  });

  newFollowRequest
    .save()
    .then((request) => res.json({ data: request, success: true }))
    .catch((err) =>
      res.status(500).json({ message: err.message, success: false })
    );
});

router.delete("/", async (req, res) => {
  const fromUser = req.query.fromUser;
  const toUser = req.query.toUser;
  const record = await FollowRequest.findOneAndDelete({
    fromUser: fromUser,
    toUser: toUser,
  });
  res.status(200).json({ data: record, success: true });
});

router.get("/getComingRequests/:toUser", async (req, res) => {
  const toUser = req.params.toUser;
  const followRequests = await FollowRequest.find({
    toUser: toUser,
    status: "pending",
  }).populate("fromUser");
  res.status(200).json({ data: followRequests, success: true });
});

router.get("/getSentRequests/:fromUser", async (req, res) => {
  const toUser = req.params.fromUser;
  const followRequests = await FollowRequest.find({
    toUser: toUser,
    status: "pending",
  }).populate("toUser");
  res.status(200).json({ data: followRequests, success: true });
});

router.get("/checkfollow/:fromUser/:toUser", async (req, res) => {
  const fromUser = req.params.fromUser;
  const toUser = req.params.toUser;

  const followRequest = await FollowRequest.findOne({
    toUser: toUser,
    fromUser: fromUser,
  });
  res
    .status(200)
    .json({ data: followRequest ? followRequest : null, success: true });
});

router.put("/accept/:requestId", (req, res) => {
  FollowRequest.findByIdAndUpdate(
    req.params.requestId,
    { status: "accepted" },
    { new: true }
  )
    .then((request) => res.json({ data: request, success: true }))
    .catch((err) =>
      res.status(500).json({ message: err.message, success: false })
    );
});

router.get("/getFollowData/:id", async (req, res) => {
  const toUser = req.params.id;

  const followers = await FollowRequest.find({
    toUser: toUser,
    status: "accepted",
  }).populate("fromUser");
  
  const followings = await FollowRequest.find({
    fromUser: toUser,
    status: "accepted",
  }).populate("toUser");

  res.status(200).json({ data: { followers, followings }, success: true });
});
// router.get("/getFriendsWardrobe/:id", async (req, res) => {
//   const userId = req.params.userId;

//   try {
//     // Find the user's friends who have accepted the friend request
//     const friends = await FollowRequest.find({
//       fromUser: userId,
//       status: "accepted",
//     });

//     // Extract the friend IDs from the friends array
//     const friendIds = friends.map((friend) => friend.toUser);

//     // Retrieve wardrobe data for the user's friends
//     const wardrobeData = await UserWardrobe.find({ userId: { $in: friendIds } })
//       .populate('userId') // Populate additional fields if needed
//       .populate('categoryId')
//       .populate('subCategoryId');

//     res.status(200).json({ data: wardrobeData, success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// });
// In your backend router file (e.g., followRequest.js)
router.get("/getWardrobe/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch wardrobe data for the specified user
    const wardrobeData = await UserWardrobe.find({ userId }).populate("categoryId").populate("subCategoryId");
    res.status(200).json({ data: wardrobeData, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

module.exports = router;
