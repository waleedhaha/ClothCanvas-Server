const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        unique: true,
    },
    detailsFilled: {
        type: Boolean,
        default: false
    },
    avatarUrl: {
        type: String,
        default: null,
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    pendingFollowRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FollowRequest'
    }]
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
