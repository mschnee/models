const { Schema } = require('mongoose');

const actionItemSchema = new Schema({
  // refs
  _company: { type: Schema.Types.ObjectId, ref: 'Company' },
  _createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  _publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  _nextStepTakenBy: { type: Schema.Types.ObjectId, ref: 'User' },
  _deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  _resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },

  // properties
  description: { type: String, default: '' },
  impact: {
    type: String,
    enum: ['none', 'normal', 'high'],
    default: 'normal',
  },
  title: { type: String, default: '' },

  // next_step
  nextStepText: { type: String, default: '' },
  nextStepType: {
    type: String,
    enum: ['bambee_next_step', 'customer_next_step', 'customer_next_qna', 'none'],
    default: 'customer_next_step',
  },
  nextStepAction: {
    type: String,
  },

  // dates
  createdAt: { type: Date, default: Date.now },
  publishedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  nextStepTakenAt: { type: Date, default: null },
  resolvedAt: { type: Date, default: null },
});

module.exports = actionItemSchema;
