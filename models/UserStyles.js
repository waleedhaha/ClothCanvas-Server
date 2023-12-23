const mongoose = require('mongoose');

const UserStyles = mongoose.model('UserStyles', {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
    name: String,
    favoriteColors: [String],
    favoriteClothes: [String],
  });

  module.exports = UserStyles;