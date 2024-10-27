const mongoose = require('mongoose');
const { format } = require('date-fns');

const userCaseGrandeSchema = new mongoose.Schema({
  idCase: {
    type: String,
    required: true,
    // ref: 'AdminCaseGrande', 
  }, 
  sede: {
    type: String,
    required: true,
  },
  instance: {
    type: String,
    required: true,
    // unique: true,
  },
  installation: {
    type: String,
    required: true,
    // unique: true,
  },
  dateProgress: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  createdBy: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  previousStatus: {
    type: String
  },
  lastModified: {
    type: Date,
  }
});

userCaseGrandeSchema.pre('save', function (next) {
  this.lastModified = new Date();
  next();
});
userCaseGrandeSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.lastModified = format(obj.lastModified, "PPPpp");
  return obj;
};
// Export the model
const UserCaseGrande = mongoose.model('UserCaseGrande', userCaseGrandeSchema);
module.exports = UserCaseGrande;
