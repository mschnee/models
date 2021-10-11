const { Schema } = require('mongoose');

const resultCompanySchema = new Schema({
  _company: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  companyName: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  companyPhone: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  owner: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  ownerPhone: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  email: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  industry: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
  zip: {
    value: { type: String, default: '' },
    score: { type: Number, default: 0 },
  },
});

const duplicateCompanySchema = new Schema({
  _company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  name: { type: String, default: '' },
  results: [resultCompanySchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
});

duplicateCompanySchema.index({
  _company: 1,
});

duplicateCompanySchema.pre('save', function () {
  this.updated_at = new Date();
});

module.exports = duplicateCompanySchema;
