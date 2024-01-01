const express = require('express');
const axios = require('axios');
const cors = require('cors');
const router = express.Router();
router.use(cors()); // Enable CORS for frontend requests

const API_KEY = 'e59670929ee1c72a507d8a62b00b5cd5'; // Your OpenWeatherMap API key

router.get('/', async (req, res) => {
    const { lat, lon } = req.query;

    console.log("Received request for weather data");
    console.log("Latitude:", lat, "Longitude:", lon);

    try {
        // Correct URL format for OpenWeatherMap API
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        console.log("Requesting weather data from URL:", url);

        const response = await axios.get(url);
        console.log("Weather data received:", response.data);

        res.json(response.data);
    } catch (error) {
        console.error("Error occurred:", error);

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Error request:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error message:", error.message);
        }

        res.status(500).json({ error: error.toString() });
    }
});

module.exports = router;
