const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require('dotenv').config();
const User = require('./models/user.model')

const app = express();
app.use(express.json());

mongoose.connect(process.env.DB_URL).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }

        res.status(200).json({ message: "Login successful!", userId: user._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error." });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
