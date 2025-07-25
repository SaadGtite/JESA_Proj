const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['Constructor Manager', 'Project Manager'],
      default: 'Project Manager',
    },
  },
  {
    timestamps: true, // ➕ Ajoute createdAt et updatedAt automatiquement
  }
);

module.exports = mongoose.model('User', userSchema);
