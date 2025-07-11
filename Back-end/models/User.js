const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // keep username unique
  email: { type: String, required: true, unique: true },    // email must be unique too
  password: { type: String, required: true },
  role: { type: String, enum: ['Constructor Manager', 'Project Manager'], default: 'Project Manager' }
});

module.exports = mongoose.model('User', userSchema);
