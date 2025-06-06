const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/UserModel');
require('dotenv').config();

// Signup Endpoint
router.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, password, age, phonenumber, roleId } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            age,
            phonenumber,
            roleId
        });

        res.status(201).json({ message: "User registered successfully!", data: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate("roleId");

        if (!user) return res.status(404).json({ message: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        const token = jwt.sign({ id: user._id, roleId: user.roleId }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.json({ message: "Login successful", token, user });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error });
    }
});

module.exports = router;
