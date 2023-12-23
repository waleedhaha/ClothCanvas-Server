const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User"); // Replace "User" with your actual user model
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tahoorp@gmail.com",
    pass: "pmpb ouew tnmv pmti",
  },
});

// Mailer function to send verification code
async function mailer(recipientEmail, code) {
  try {
    const info = await transporter.sendMail({
      from: 'ClothCanvas@gmail.com',
      to: recipientEmail,
      subject: "SignUp Verification",
      text: `Your Verification Code is ${code}`,
      html: `<b>Your Verification Code is ${code}</b>`,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// User Preferences Model
const UserPreferences = mongoose.model('UserPreferences', {
  name: String,
  age: Number,
  dob: Date,
  height: Number,
  occupation: String,
  weight: Number,
  bodyType: String,
  skinTone: String,
});

// In-memory storage for user style preferences
const stylePreferences = {};

router.post('/user-style-preferences', (req, res) => {
  const { userId, favoriteColors, favoriteClothes } = req.body;

  if (!userId || !favoriteColors || !favoriteClothes) {
    return res.status(400).json({ message: 'Invalid data' });
  }

  // Store the user's style preferences
  stylePreferences[userId] = {
    favoriteColors,
    favoriteClothes,
  };

  res.status(201).json({ message: 'Style preferences saved successfully' });
});

router.get('/user-style-preferences/:userId', (req, res) => {
  const userId = req.params.userId;

  if (!stylePreferences[userId]) {
    return res.status(404).json({ message: 'Style preferences not found' });
  }

  const preferences = stylePreferences[userId];
  res.status(200).json(preferences);
});

module.exports = router;
