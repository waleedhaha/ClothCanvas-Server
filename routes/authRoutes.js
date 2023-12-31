const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const userPreferences = require('../models/UserPreferences'); // Adjust the path as necessary


// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "tahoorp@gmail.com",
    pass: "pmcn xwhd fggz bclu",
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
  const { name, email, password, verificationCode, otp } = req.body;
  console.log("verificationCode", verificationCode)
  const user = new User({
    name,
    email,
    password,
    verificationCode,
    otp: Math.floor(100000 + Math.random() * 900000)
  })
  console.log("user", user)
  try {
    const userAlreadyExists = await User.findOne({ email: email });
    if (userAlreadyExists) {
      console.log("User already exists with this email");
      return res.status(422).json({ error: "User already exists with this email" });
    }
    const savedUser = await user.save();
    console.log(savedUser)
    const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);
    res.send({ message: "User Registered Successfully", token });
  } catch (err) {
    console.log("err", err);
  }
})

router.post('/verify', (req, res) => {
  const { name, email, password } = req.body;
  console.log("req.body", req.body)
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

  try {
    const savedUser = await User.findOne({ email: email });
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, savedUser.password);
    if (!isPasswordMatch) {
      console.log('Password does not match');
      return res.status(422).json({ error: "Invalid Credentials" });
    }

    // Check if user's preferences exist
    const preferencesExist = await userPreferences.exists({ userId: savedUser._id });

    const token = jwt.sign({ _id: savedUser._id }, process.env.jwt_secret);

    res.send({ 
      token,
      detailsFilled: !!preferencesExist, // Convert to boolean
      user: savedUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/get-user',async (req, res) => {
    // Extract the token from the request headers, query params, or wherever it is stored
    const token = req.headers.authorization; // Example: Bearer <token>
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    try {
      // Verify and decode the token
      const decoded = jwt.verify(token.split(' ')[1], process.env.jwt_secret);
  
      // The user ID is now available in the `decoded` object
      const userId = decoded._id;
  
      // You can use the user ID to retrieve the user information from your database
      // Replace the following line with your logic to fetch user details from the database
      const user =  await User.findById({ _id: userId });
      if(user) res.json({ user });
      else {
        res.json({data:null, msg:"User not found"})
      }
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
})


module.exports = router;
