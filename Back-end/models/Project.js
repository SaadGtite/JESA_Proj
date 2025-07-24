const mongoose = require('mongoose');
const CrrSchema = require('./Crr');

const projectSchema = new mongoose.Schema({
  'responsible office': { type: String, required: true },
  'name project': { type: String, required: true },
  'number project': { type: String, required: true },
  'project scope': { type: String, required: true },
  'manager constructor': { type: String, required: true },
  'manager': { type: String, required: true },
  'review date': { type: Date, required: true },
  'review team members': [{ type: String, required: true }],
  'project members interviewed': [{ type: String, required: true }],
  'location': { type: String },
  'picture': { 
    type: String, 
    default: null,
    validate: {
      validator: function(v) {
        if (v === null) return true; // Allow null
        // Updated regex to handle accented characters and broader filename support
        return /^(\/uploads\/[\p{L}\p{N}\-_.]+\.(jpg|jpeg|png|gif)|https?:\/\/)/u.test(v);
      },
      message: props => `${props.value} is not a valid image path or URL!`
    }
  },
  'sectorManager': { 
    type: String, 
    enum: ['Water', 'Energy', 'Construction', 'Transportation', 'Healthcare', 'Education', 'Other'],
    default: 'Other' 
  },
  crrs: { type: [CrrSchema], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);