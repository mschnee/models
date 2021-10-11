const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resignationSchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  _company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  _document: { type: Schema.Types.ObjectId, ref: 'Document', default: null },
  _acknowledgement: { type: Schema.Types.ObjectId, ref: 'Acknowledgement', default: null },
  _ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', default: null },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  last_date: { type: Date, default: '' },
  description: {
    reason: {
      code: { type: String, default: '' },
      name: { type: String, default: '' },
    },
    text: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['started', 'awaiting approval', 'awaiting acknowledgement', 'awaiting signature', 'completed', 'cancelled'],
    default: 'started',
  },
  hr_provide: { type: Boolean, default: false },
  file: {
    url: { type: String, default: '' },
    filename: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    id: { type: Number },
    uploaded_date: { type: Date, default: Date.now },
    employee_provided: { type: Boolean, default: false },
    employer_provided: { type: Boolean, default: false },
  },
  // ack: { type: Schema.Types.ObjectId, ref: 'Acknowledgement' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: '' },
  reinstated_at: { type: Date, default: null },
  _reinstated_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
});

module.exports = resignationSchema;
