const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();
router.use(cors()); // Enable CORS for frontend requests

const API_KEY = '06c0b77d13ece13a5dedc1ad3253e97d'; // Replace with your API key
// const PORT = process.env.PORT || 3000;

router.get('/weather', async (req, res) => {
    res.send('Weather endpoint reached');
    const { lat, lon } = req.query;
    try {
        const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
module.exports = router;
