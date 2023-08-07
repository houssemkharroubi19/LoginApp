const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const router = express.Router();

// Helper function to check the password format
const isPasswordValid = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#\$%^&*_\-+=`|(){}\[\]:;"'<>,.?/]).{8,}$/;

  return passwordRegex.test(password);
};

router.post('/register', async (req, res) => {
  const { name, company, email, password } = req.body;

  

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered.' });
      return;
    }

    // If the email and password match the backend's initial login credentials,
    // you can add additional validation here if needed.
    // For example, you can have a predefined email and password stored in an environment variable.

    const newUser = new User({ name, company, email, password });
    await newUser.save();

    res.json({ message: 'Registration successful. You can now log in.'});
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
