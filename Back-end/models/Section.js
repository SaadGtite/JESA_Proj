// models/Section.js
const mongoose = require('mongoose');
const QuestionSchema = require('./Question');

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] }
});

module.exports = SectionSchema;
