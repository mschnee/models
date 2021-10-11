const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  type: {
    type: String,
    enum: ['punctuality', 'company', 'team', 'job', 'communication', 'quality'],
    default: 'punctuality',
  },
  status: { type: String, enum: ['complete', 'current', 'pending'], default: 'pending' },
  question: { type: String, default: '' },
  answerField: { type: String, default: '' }, // i don't understand this. is this supposed to be the text value?
  value: { type: String, default: '' },
  example: { type: String, default: '' },
});

const employeeReviewSchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User' },
  _company: { type: Schema.Types.ObjectId, ref: 'Company' },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [reviewSchema],
  additionalNotes: { type: String, default: '' },
  employeeNote: { type: String, default: '' },
  reviewScore: { type: String, default: '' },
  status: {
    type: String,
    enum: ['created', 'saved', 'meeting', 'meeting-had', 'signature', 'completed'],
    default: 'created',
  }, //send = means NEED to send to employee
  employee_signature: {
    _employee: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, default: '' },
    signed_date: { type: String, default: '' },
    signed_timestamp: { type: Date, default: '' },
    ip: { type: String, default: '' },
  },

  completed_at: { type: Date },
  sent_at: { type: Date },
  meet_at: { type: Date },
  finalized_at: { type: Date },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: '' },
});

employeeReviewSchema.pre('save', function () {
  this.updated_at = new Date();
});

employeeReviewSchema.methods.eventData = async function () {
  await this.populate('_employee _company _created_by').execPopulate();

  return {
    _id: this._id,
    _employee: await this._employee.eventData(),
    _company: this._company.eventData(),
    _created_by: await this._created_by.eventData(),
    created_at: this.created_at,
    status: this.status,
  };
};

module.exports = employeeReviewSchema;
