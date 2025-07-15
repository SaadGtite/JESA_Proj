// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  actions: { type:String, default: false },
  referenceDocument: { type:String, default: false },
  deliverable: { type:String, default: false },
  score: { 
    type: Number, 
    enum: [0, 2.5, 5],
    default: null
  },
  isNA: { type: Boolean, default: false }, 
  showstopper: { type: Boolean, default: false },
  comments: { type:String, default: false }
});

module.exports = QuestionSchema;
