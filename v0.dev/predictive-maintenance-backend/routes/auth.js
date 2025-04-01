// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

router.use(express.urlencoded({ extended: true })); // Add middleware to parse x-www-form-urlencoded

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, factory } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      factory,
    });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      res.json({ token, isAdmin: user.isAdmin });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  });

router.post('/forgot-password', (req, res) => {
  res.json({ message: 'Forgot password functionality not implemented yet' });
});

module.exports = router;