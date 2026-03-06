// AI-Generated Login System
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Added for advanced security

const app = express();
app.use(express.json());
app.use(session({ secret: 'ai_secret_key', resave: false, saveUninitialized: false }));

mongoose.connect('mongodb://127.0.0.1:27017/studentDB');

const userSchema = new mongoose.Schema({ 
    username: { type: String, required: true, unique: true }, 
    passwordHash: { type: String, required: true } 
});
const UserModel = mongoose.model('AIUser', userSchema);

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register() {
        const hash = await bcrypt.hash(this.password, 10);
        await UserModel.create({ username: this.username, passwordHash: hash });
        return "User registered successfully";
    }

    async login() {
        const user = await UserModel.findOne({ username: this.username });
        if (user && await bcrypt.compare(this.password, user.passwordHash)) {
            return true;
        }
        return false;
    }
}

app.post('/register', async (req, res) => {
    try {
        const result = await new User(req.body.username, req.body.password).register();
        res.send(result);
    } catch (err) { res.status(400).send("Registration failed"); }
});

app.post('/login', async (req, res) => {
    const success = await new User(req.body.username, req.body.password).login();
    if (success) {
        req.session.user = req.body.username;
        res.send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.listen(3000, () => console.log('AI Server running'));