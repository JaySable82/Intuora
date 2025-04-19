import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const router = express.Router();
require('dotenv').config();

const User = require('../models/User');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1) Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // 2) Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // 3) Sign JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = app;
