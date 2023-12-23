const express = require("express");
const router = express.Router();
const multer = require("multer");

// const Joi = require('joi');
// const Item = require('../models/item');

// Define a schema for the mandatory information
// const itemSchema = Joi.object({
//     color: Joi.string().required(),
//     type: Joi.string().valid('jeans', 'shirt', 'shoes', 'hat', 'trouser', 'shorts').required(),
// });

// router.post('/', upload.single('image'), async (req, res) => {
//     try {
//         // Validate the mandatory information
//         const { error, value } = itemSchema.validate(req.body);
//         if (error) {
//             return res.status(400).json({ error: error.details[0].message });
//         }

//         // Create a new item with the mandatory information and the image URL
//         const item = new Item({
//             color: value.color,
//             type: value.type,
//             imageUrl: req.file.path,
//             optional: req.body.optional // optional information can be added to the request body
//         });

//         // Save the item to the database
//         await item.save();

//         // Return a success response
//         res.status(200).json({ message: 'Upload successful' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }

//     console.log(req.file, req.body);
//     res.send('File uploaded successfully!');
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB file size limit
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  console.log(req.file, req.body);
  try {
    // Handling Multer errors
    // if (req.fileValidationError) {
    //   return res.status(400).send(req.fileValidationError);
    // }

    // Other errors handled by Multer
    // if (!req.file && !err) {
    //   return res.status(400).send("Please upload a file.");
    // }

    // // If Multer error
    // if (err) {
    //   if (err.code === "LIMIT_FILE_SIZE") {
    //     return res.status(400).send("File is too large. Maximum size is 10MB.");
    //   }
    //   return res.status(500).send(err.message);
    // }

    // Return a success response
    res
      .status(200)
      .json({success:true, message: "Upload successful", imageUrl: req.file.filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
