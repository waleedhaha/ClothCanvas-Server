const mongoose = require("mongoose");

const userWardrobeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: String,
    size: Number,
    waistSize: Number,
    shoeSize: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
  },
  {
    timestamps: true, // Enables automatic creation of createdAt and updatedAt fields
  }
);

const UserWardrobe = mongoose.model("UserWardrobe", userWardrobeSchema);

module.exports = UserWardrobe;
