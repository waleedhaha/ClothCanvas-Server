const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
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

router.post('/signup', async (req, res) => {
  const { name, email, password, verificationCode } = req.body;

  const user = new User({
    name,
    email,
    password,
    verificationCode
  })

  try {
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.jwt_secret);
    res.send({ message: "User Registered Successfully", token });
  } catch (err) {
    console.log(err);
  }
})

router.post('/verify', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email })
    .then(async (savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      try {
        let verificationCode = Math.floor(100000 + Math.random() * 900000);
        let user = [
          {
            name,
            email,
            password,
            verificationCode
          }
        ]
        await mailer(email, verificationCode);
        res.send({ message: "Verification Code Sent to your Email", udata: user });
      }
      catch (err) {
        console.log(err);
      }
    })
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  const savedUser = await User.findOne({ email: email })

  if (!savedUser) {
    return res.status(422).json({ error: "Invalid Credentials" });
  }

  try {
    bcrypt.compare(password, savedUser.password, (err, result) => {
      if (result) {
        console.log("Password matched");
        const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
        res.send({ token });
      }
      else {
        console.log('Password does not match');
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    })
  }
  catch (err) {
    console.log(err);
  }
})

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

router.post('/user-preferences', async (req, res) => {
  const { name, age, dob, height, occupation, weight, bodyType, skinTone } = req.body;

  const userPreferences = new UserPreferences({
    name,
    age,
    dob,
    height,
    occupation,
    weight,
    bodyType,
    skinTone
  });

  try {
    await userPreferences.save();
    res.status(201).json(userPreferences);
  } catch (err) {
    console.log(err);
  }
});

router.get('/user-preferences', async (req, res) => {
  try {
    const preferences = await UserPreferences.find();
    res.json(preferences);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
