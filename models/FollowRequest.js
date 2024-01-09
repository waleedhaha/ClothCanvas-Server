const mongoose = require('mongoose');

const FollowRequest = mongoose.model('FollowRequest', {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String // can be 'pending', 'accepted', 'rejected'
  });

module.exports = FollowRequest;
