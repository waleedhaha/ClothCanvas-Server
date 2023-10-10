const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.my_URL).then (
() => {
  console.log('Connected to the database');
}
)
.catch((err) => {
  console.log('Error connecting to the database: ' + err);
});
