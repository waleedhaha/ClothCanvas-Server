const express = require('express');
const cors = require('cors');  // Add this line
//const axios = require('axios');
const port = 3000;
const app = express();
const bodyParser = require('body-parser');


require('./db');  
require('./models/User');  
const authRoutes = require('./routes/authRoutes');
const requireToken = require('./Middlewarss/AuthTokenRequired')

const uploadImage = require('./routes/uploadimage')
const WeatherApi = require('./routes/WeatherApi')
const userPreferences = require('./routes/userPreferences')
const userStyles = require('./routes/userStyles')
const categories = require('./routes/category')
const subCategories = require('./routes/subCategory')
const userWardrobe = require('./routes/userWardrobe')
const discover = require('./routes/discover')
const followRequest = require('./routes/followRequest')
const friendswardrobe = require('./routes/friendswardrobe')





app.get('/test', requireToken, (req, res) => {
  res.json({msg:"Server is running"});
});

app.use(bodyParser.json());
app.use(cors());  // Use CORS middleware
app.use(authRoutes);
app.use('/uploads', express.static('uploads'));


app.get('/', requireToken, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});
app.use('/weather', WeatherApi);
app.use('/user-preferences',  userPreferences);
app.use('/user-styles',  userStyles);
app.use('/categories',  categories);
app.use('/subcategories',  subCategories);
app.use('/user-wardrobe',  userWardrobe);
app.use('/discover',  discover);
app.use('/follow-request',  followRequest);
app.use('/friends-wardrobe',  friendswardrobe);



app.use('/uploadFile', uploadImage);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${port}`);
});
