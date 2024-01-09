const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const UserPreferences = require("../models/UserPreferences"); // adjust the path as necessary

require('dotenv').config();


router.get("/getalluser/:currentUser", async (req, res) => {
    try {
      const preferences = await User.find({_id:{$ne:req.params.currentUser}});
      res.json({data:preferences, success:true});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/getspecificprofile/:userId", async (req, res) => {
    try {
      const preferences = await User.findOne({_id: req.params.userId});
      res.json({data:preferences, success:true});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  module.exports = router;
