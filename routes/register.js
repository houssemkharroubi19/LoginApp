const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, company, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered.' });
      return;
    }

    const newUser = new User({ name, company, email, password });
    await newUser.save();

    res.json({ message: 'Registration successful. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
