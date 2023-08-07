const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET_KEY || '5WjBt88O7d'; 

// Helper function to check password validity
const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ error:  'email Invalid  ' });
      return;
    }

    if (!isValidPassword(password, user.password)) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

  // Generate and send the JWT token and user's ID
  const token = jwt.sign({ userId: user._id }, jwtSecretKey, { expiresIn: '1h' });

  res.json({ token, userId: user._id });
} catch (err) {
  res.status(500).json({ error: 'Internal server error.' });
}
});

module.exports = router;
