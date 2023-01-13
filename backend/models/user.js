// We imports mongoose and uniqueValidator packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// User model schema creation
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Apply the uniqueValidator plugin to userSchema
userSchema.plugin(uniqueValidator);

// We exports the user model
module.exports = mongoose.model('User', userSchema);