const express = require('express');
const router = express.Router();
const Application = require('../models/application');
const bcrypt = require('bcrypt');
const jwtSecretKey = require('../app.js');
const jwt = require('jsonwebtoken');

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Unauthorized: Missing or invalid authorization header.');
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const token = authHeader.substring('Bearer '.length);

  try {
    const decodedToken = jwt.verify(token, jwtSecretKey);
    console.log('Token decoded successfully:', decodedToken);
    const user = await User.findOne({ email: decodedToken.email });

    if (!user) {
      console.log('Unauthorized: User not found.');
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Error while verifying token:', err.message);
    return res.status(401).json({ error: 'Unauthorized.' });
  }
};

// Create a new application
router.post('/applications', async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const secretKey = await bcrypt.genSalt(10);

    // Check if the user ID is provided in the request body
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required.' });
    }

    // Check if the application name is already used by the user
    const existingApplication = await Application.findOne({ name, user: userId });
    if (existingApplication) {
      return res.status(409).json({ error: 'Application name must be unique for each user.' });
    }

    // Create the application and associate it with the provided user ID
    const application = await Application.create({
      name,
      description,
      secretKey,
      user: userId,
    });

    res.json({ message: 'Application added successfully.', application });
  } catch (error) {
    console.error('Error while creating application:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

//get by user id 
// Get applications by user id
router.get('/applications', async (req, res) => {
  try {
    const { userId } = req.query; // Get the userId from the query parameters
    console.log('Request Query:', req.query); // Log the request query to check its content

    // Populate the applications field to get details of the user's applications
    const applications = await Application.find({ user: userId });
    console.log('Applications:', applications); // Log the applications fetched from the database

    res.json(applications);
  } catch (error) {
    console.error('Error while fetching applications:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Get all applications without authentication
router.get('/applications/all', async (req, res) => {
  try {
    // Find all applications in the database
    const applications = await Application.find();
    console.log('Applications:', applications); // Log the applications fetched from the database

    // Extract the name and description fields from each application
    const applicationData = applications.map((app) => ({
      name: app.name,
      description: app.description,
    }));
    console.log('Application Data:', applicationData); // Log the extracted application data

    res.json(applicationData);
  } catch (error) {
    console.error('Error while fetching applications:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});





// Update an application
router.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Find the application by ID and user ID to ensure the application belongs to the user
    const application = await Application.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    console.log('Updated application:', application); // Log the updated application

    res.json(application);
  } catch (error) {
    console.error('Error while updating application:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});





// Delete an application
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the application by ID and user ID to ensure the application belongs to the user
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    console.log('Deleted Application:', application); // Log the deleted application

    res.json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Error while deleting application:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});




module.exports = router; // Export the router object