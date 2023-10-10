const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(422).send({ error: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ error: "Email is already registered" });
    }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();
     const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
     res.send({ token});
    //res.send({ message: "User saved successfully" });
  } 
  
  catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send({ error: "Something went wrong, please try again" });
  }
});

module.exports = router;
