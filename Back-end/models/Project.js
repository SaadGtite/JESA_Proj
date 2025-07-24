const mongoose = require('mongoose');
const CrrSchema = require('./Crr');

const projectSchema = new mongoose.Schema({
  'responsible office': { type: String },
  'name project': { type: String, required: true },
  'number project': { type: String, required: true },
  'project scope': { type: String, required: true },
  'manager constructor': { type: String, required: true },
  'manager': { type: String, required: true },
  'review date': { type: Date, required: true },
  'review team members': [{ type: String }],
  'project members interviewed': [{ type: String }],
   crrs: { type: [CrrSchema], default: [] }
});

module.exports = mongoose.model('Project', projectSchema);