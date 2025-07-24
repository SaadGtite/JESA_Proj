const mongoose = require('mongoose');
const QuestionSchema = require('./Question');

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: { type: [QuestionSchema], default: [] }
});

SectionSchema.virtual('allQuestionsCompleted').get(function () {
  console.log('🔍 Checking allQuestionsCompleted virtual for section:', this.title);
  return this.questions.every((q, idx) => {
    const isCompleted = q.isNA === true || (q.score !== null && q.score !== undefined && q.isNA === false);
    console.log(
      `🔎 Q${idx + 1} (ID: ${q._id}) → text: "${q.text}", score: ${q.score}, isNA: ${q.isNA}, result: ${isCompleted}`
    );
    return isCompleted;
  });
});

// Ensure virtuals are included when converting to JSON
SectionSchema.set('toJSON', { virtuals: true });
SectionSchema.set('toObject', { virtuals: true });

module.exports = SectionSchema;