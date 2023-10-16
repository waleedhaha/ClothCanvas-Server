const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model("User"); // Changed to lowercase 'model'
require('dotenv').config();
module.exports = (req, res, next) => {
    const { authorization } = req.headers;

   // console.log(authorization);
if (!authorization) {
    return res.status(401).send({ error: "You must be logged in, key not given" });
}

// Extract the token using split and trim
const token = authorization.split(' ')[1].trim();
// console.log(token);
jwt.verify(token, process.env.jwt_secret, (err, payload) => {
    if (err) {
        return res.status(401).json({ error: "You must be logged in, token invalid" });
    }
    const { _id } = payload;
    User.findById(_id).then(userData => {  // Corrected variable name here
        req.user = userData;
        next();
    });
})
}