// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  actions: { type:String, default: '' },
  referenceDocument: { type:String, default: '' },
  deliverable: { type:String, default: '' },
  score: { 
    type: Number, 
    enum: [0, 2.5, 5],
    default: null
  },
  isNA: { type: Boolean }, 
  showstopper: { type: Boolean },
  comments: { type:String, default: '' },
});

module.exports = QuestionSchema;
