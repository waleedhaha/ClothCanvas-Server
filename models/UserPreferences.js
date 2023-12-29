const mongoose = require('mongoose');

const UserPreferences = mongoose.model('UserPreferences', {
    name: String,
    age: Number,
    dob: String,
    height: String,
    occupation: String,
    weight: Number,
    bodyType: String,
    skinTone: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  });
  
  module.exports = UserPreferences;