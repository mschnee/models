const { Schema } = require('mongoose');

const filestackSchema = require('./FilestackSchema');

const employeeNoteSchema = new Schema({
  _employee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['incident', 'general'] },
  flag: { type: Boolean, default: false },
  text: { type: String, default: '' },
  attachments: [{ type: filestackSchema, default: null }],
  log_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: '' },
  active: { type: Boolean, default: true },
});

employeeNoteSchema.pre('save', function () {
  this.updated_at = new Date();
});

module.exports = employeeNoteSchema;
