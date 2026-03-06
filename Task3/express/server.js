const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

// Import the route files
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const dashboardRoute = require('./routes/dashboard');
const logoutRoute = require('./routes/logout');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'my_super_secret_key',
    resave: false,
    saveUninitialized: false
}));

// MongoDB Connection
const dbURI = 'mongodb://127.0.0.1:27017/studentDB';

mongoose.connect(dbURI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Use the routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/dashboard', dashboardRoute);
app.use('/logout', logoutRoute);

// Basic test route
app.get('/', (req, res) => {
    res.send('Server is running and ready!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});