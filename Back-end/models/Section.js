const mongoose = require('mongoose');
const QuestionSchema = require('./Question');

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] }
});

// Virtual field to check if all questions are completed
SectionSchema.virtual('allQuestionsCompleted').get(function() {
  return this.questions.every(question => {
    return question.score !== null && !question.isNA;
  });
});

// Ensure virtuals are included when converting to JSON
SectionSchema.set('toJSON', { virtuals: true });
SectionSchema.set('toObject', { virtuals: true });

module.exports = SectionSchema;