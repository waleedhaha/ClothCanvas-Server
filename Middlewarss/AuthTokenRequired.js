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
//

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // if (!email || !password || !name) {
    //   return res.status(422).send({ error: "Please fill all the fields" });
    // }

    // const existingUser = await User.findOne({ email });

    // if (existingUser) {
    //   return res.status(422).send({ error: "Email is already registered" });
    // }

    const user = new User({
      name,
      email,
      password
    });

    await user.save();
     const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
     res.send({ message: "User Registered Sucsessfully",token});
    //res.send({ message: "User saved successfully" });
  } 
  
  catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send({ error: "Something went wrong, please try again" });
  }
})
router.post('/Verify', async (req, res) => {
  console.log('sent by client -', req.body);
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(422).send({ error: "Please fill all the fields" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).json({ error: "Email is already registered" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 90000);
    const user = new User({
      name,
      email,
      password,
      verificationCode,
    });

    await user.save();
    await mailer(email, verificationCode);
    res.send({ message: "Verification code sent to your mail", uData: user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Something went wrong, please try again" });
  }
});

module.exports = router