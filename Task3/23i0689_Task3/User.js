const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register() {
        try {
            const newUser = new UserModel({
                username: this.username,
                password: this.password
            });
            
            await newUser.save();
            return { success: true, message: "User registered successfully" };
        } catch (error) {
            return { success: false, message: "Registration failed. Username might already exist." };
        }
    }

    async login() {
        try {            
            const foundUser = await UserModel.findOne({
                username: this.username,
                password: this.password
            });

            if (foundUser) {
                return { success: true, message: "Login successful" };
            } else {
                return { success: false, message: "Invalid credentials" };
            }
        } catch (error) {
            return { success: false, message: "Error during login" };
        }
    }
}

module.exports = User;