const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReasonSchema = new Schema({
  code: { type: Number, required: true }, // identifier for the reason, should never change once in use
  externalText: { type: String, maxlength: 50 },
  internalText: { type: String, maxlength: 50 },
  internalOnly: { type: Boolean, default: false, required: true },
  active: { type: Boolean, default: true, required: true },
  rebuttalOrder: { type: Number },
  rebuttalData: {
    tagline: { type: String },
    title: { type: String },
    member: { type: String },
    text: { type: String },
    content: { type: String },
    primaryAction: { type: String },
    primaryActionIcon: { type: String },
    secondaryAction: { type: String },
    acceptanceText: { type: String },
  },
});

const ReasonGroupSchema = new Schema({
  code: { type: String, required: true }, // identifier for the group, should never change once in use
  externalText: { type: String, maxlength: 50 },
  internalText: { type: String, maxlength: 50 },
  reasons: [ReasonSchema], // order is given by order in the array
});

const cancellationReasonsSchema = new Schema({
  groups: [ReasonGroupSchema], // order is given by order in array
});

module.exports = cancellationReasonsSchema;
