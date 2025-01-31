const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');

const router = express.Router();



router.post('/register', async (req, res) => {
    try {
        console.log("Incoming request body:", req.body); // Debugging

        const { name, email, password, confirm_password } = req.body;

        if (!name || !email || !password || !confirm_password) {
            console.log("Missing fields");
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirm_password) {
            console.log("Passwords do not match");
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = new User({ name, email, password });

        await newUser.save();
        console.log("User saved successfully");
        res.status(201).json({ message: 'User registered successfully' });

    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
   
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        if (!process.env.JWT_SECRET) {
            throw new Error('Missing JWT_SECRET in environment variables');
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        req.session.user = user;
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login Error:', err);  // Log full error
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
module.exports = router;
