const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const acknowledgementSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  _company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  _created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  _documents: [{ type: Schema.Types.ObjectId, ref: 'Document', default: null }],

  type: { type: String, default: '' },
  kind: { type: 'String', enum: ['file', 'document'] },

  title: { type: 'String', default: '' },
  description: { type: 'String', default: '' },

  files: [
    {
      url: { type: String, default: '' },
      filename: { type: String },
      mimetype: { type: String },
      size: { type: Number },
      id: { type: Number },
      uploaded_date: { type: Date, default: Date.now },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  ],

  acknowledged: { type: Boolean, default: false },
  acknowledged_at: { type: Date, default: null },
  ip: { type: String, default: '' },

  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

acknowledgementSchema.pre('save', function () {
  if (this.acknowledged && !this.acknowledged_at) {
    this.acknowledged_at = new Date();
  }
});

module.exports = acknowledgementSchema;
