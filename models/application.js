const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  secretKey: { type: String, required: true, unique: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
