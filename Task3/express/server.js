const express = require('express');
const mongoose = require('mongoose'); // Import Mongoose
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const dbURI = 'mongodb://127.0.0.1:27017/studentDB'; // Connects to local MongoDB and studentDB

mongoose.connect(dbURI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Basic test route
app.get('/', (req, res) => {
    res.send('Server is running and ready!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});