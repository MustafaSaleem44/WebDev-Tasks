const mongoose = require('mongoose');

// 1. Define the Mongoose Schema (This tells MongoDB what a user looks like)
// We require a username and password as per the assignment instructions.
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// 2. Create the Mongoose Model (This creates the 'users' collection in the database)
const UserModel = mongoose.model('User', userSchema);

// 3. Create the User Class as required by your assignment
class User {
    constructor(username, password) {
        this.username = username; [cite: 4]
        this.password = password; [cite: 5]
    }

    // Method to save the user to MongoDB
    async register() { [cite: 5]
        try {
            // Create a new database entry using the Mongoose model
            const newUser = new UserModel({
                username: this.username,
                password: this.password
            });
            
            // Save it to MongoDB
            await newUser.save();
            return { success: true, message: "User registered successfully" };
        } catch (error) {
            return { success: false, message: "Registration failed. Username might already exist." };
        }
    }

    // Method to check if the user exists in MongoDB
    async login() { [cite: 5]
        try {
            // Search the database for a matching username and password
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

// Export the class so we can use it in server.js
module.exports = User;