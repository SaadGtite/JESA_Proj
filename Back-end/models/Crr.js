// models/Crr.js
const mongoose = require('mongoose');
const SectionSchema = require('./Section');

const CrrSchema = new mongoose.Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  sections: { type: [SectionSchema], default: [] }
});

CrrSchema.set('toJSON', { virtuals: true });
CrrSchema.set('toObject', { virtuals: true });

module.exports = CrrSchema;
