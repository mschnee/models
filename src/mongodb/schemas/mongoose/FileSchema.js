const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeletedSchema = require('./lib/DeletedSchema');

const fileSchema = new Schema({
  _company: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
  _uploaded_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  _employee: { type: Schema.Types.ObjectId, ref: 'User', default: null },

  title: { type: String, default: '' },
  description: { type: String, default: '' },

  container: { type: String },
  filename: { type: String },

  handle: { type: String },
  key: { type: String },

  mimetype: { type: String },
  originalPath: { type: String },
  size: { type: Number },
  source: { type: String },
  status: { type: String },
  url: { type: String },

  local: { type: Boolean, default: false },

  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },

  deletion: { type: DeletedSchema },
});

module.exports = fileSchema;
