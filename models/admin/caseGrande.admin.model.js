const mongoose = require('mongoose');

const adminCaseGrandeSchema = new mongoose.Schema({
  idCase: {
    type: String,
    required: true,
    unique: true,
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  receiptDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
const AdminCaseGrande = mongoose.model( 
  'AdminCaseGrande',
  adminCaseGrandeSchema
);
module.exports = AdminCaseGrande;
