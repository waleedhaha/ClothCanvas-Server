const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
        type : String ,
        unique: true
    },
    detailsFilled: {
        type: Boolean,
        default: false
    },
    avatarUrl: {
        type: String,
        default: null,
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    console.log("Just before hashing", user.password);
    if (!user.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword; // Assign to user.password
        console.log("Just before saving", user.password);
        next();
    } catch (error) {
        return next(error);
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
