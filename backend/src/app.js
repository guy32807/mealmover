const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const restaurantRoutes = require('./routes/restaurants');
const dbConfig = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;  // Change from 5000 to 5001 or another free port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
dbConfig();

// Routes
app.use('/api/restaurants', restaurantRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});