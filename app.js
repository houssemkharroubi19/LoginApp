const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');

dotenv.config();
const app = express();
const port = 3000;
const jwtSecretKey = process.env.JWT_SECRET_KEY || '5WjBt88O7d4'; 

//  MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/login-app";
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log("db connection established");
  })
  .catch((error) => {
    console.log("db connection failed");
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// user model ali esna3tou
const User = require('./models/user');

//  login and register routes 
app.use('/api', loginRoute);
app.use('/api', registerRoute);

// verify JWT token for protected routes
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized. Token 8ALET.' });
    return;
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: 'Unauthorized. Invalid token.' });
      return;
    }

    req.user = decoded;
    next();
  });
};

// Protected route (example)
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route.' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
